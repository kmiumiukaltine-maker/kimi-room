// V2 stub · maintainer seed content stripped. Type kept for page import compat.
// V2 pages read from MemoStore (IDB) instead.

export type Memo = {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  topic: string;
  body: string;
};

export const MEMOS: Memo[] = [];

export function findMemo(_slug: string): Memo | undefined {
  return undefined;
}
