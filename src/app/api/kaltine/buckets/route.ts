// Server-side proxy for kaltine bucket API.
// Avoids mixed-content issues when Vercel (HTTPS) fetches the VPS (HTTP).
export const dynamic = "force-dynamic";

export async function GET() {
  const base = process.env.KALTINE_URL ?? "http://43.155.158.24/kaltine";
  try {
    const res = await fetch(`${base}/api/buckets`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      return Response.json({ error: "upstream error", status: res.status }, { status: 502 });
    }
    const data = await res.json();
    return Response.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 502 });
  }
}
