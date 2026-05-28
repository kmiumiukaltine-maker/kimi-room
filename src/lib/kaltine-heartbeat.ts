// Kaltine → HeartbeatData adapter.
// Fetches from /api/kaltine/buckets (server-side proxy) and converts to
// SkyStar / PulseEntry so HeartbeatClient can render without IndexedDB.

import type { HeartbeatData, SkyStar, PulseEntry } from "./heartbeat-data";
import { SKY_MAX } from "./heartbeat-data";
import type { ValenceTag } from "./score-colors";

type KaltineBucket = {
  id: string;
  name: string;
  valence: number;      // 0-1
  arousal: number;      // 0-1
  importance: number;   // 0-10
  pinned: boolean;
  created: string;      // "2026-05-13T04:12:28" (UTC, no Z)
  content_preview: string;
  tags: string[];
};

function valenceTag(v: number): ValenceTag {
  if (v < 0.3) return "brooding";
  if (v < 0.55) return "calm";
  if (v < 0.8) return "warmth";
  return "towardHer";
}

function jstHour(isoNoZ: string): number {
  const d = new Date(isoNoZ + "Z");
  const jst = new Date(d.getTime() + 9 * 3600 * 1000);
  return jst.getUTCHours();
}

function bucketToStar(b: KaltineBucket): SkyStar {
  return {
    id: b.id,
    source: "memory",
    title: b.name,
    content: b.content_preview,
    createdAt: b.created + "Z",
    valence: valenceTag(b.valence),
    pinned: b.pinned,
    importance: Math.min(1, b.importance / 10),
  };
}

function bucketToPulse(b: KaltineBucket): PulseEntry {
  return {
    id: b.id,
    kind: "manual",
    at: b.created + "Z",
    hour: jstHour(b.created),
    valence: valenceTag(b.valence),
    arousal: b.arousal,
    note: b.name,
  };
}

export async function loadKaltineHeartbeatData(): Promise<HeartbeatData> {
  let buckets: KaltineBucket[] = [];
  try {
    const res = await fetch("/api/kaltine/buckets", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) buckets = data;
    }
  } catch {}

  // sort by importance desc, tie-break by created desc
  buckets.sort((a, b) => {
    if (b.importance !== a.importance) return b.importance - a.importance;
    return b.created.localeCompare(a.created);
  });

  const top = buckets.slice(0, SKY_MAX);
  const stars = top.map(bucketToStar);
  const pulses = top.map(bucketToPulse);

  const pinned = stars.find((s) => s.pinned);
  const newest = [...stars].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  const poleStarId = pinned?.id ?? newest?.id ?? null;

  return { stars, pulses, poleStarId };
}
