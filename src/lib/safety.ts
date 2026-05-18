// Token denylist for public-facing surfaces (diary / ask / quotes).
// Matched case-insensitive against title, summary, content.
// NOT meant to be exhaustive — defense in depth on top of memoryType / experiencer filters.
// When in doubt, add the token. False negatives leak intimate content; false positives hide safe memories — preferring the latter.
export const FORBIDDEN_TOKENS = [
  "intimate",
  "scene",
  "CNC",
  "sub/brat",
  "花生",
  "safeword",
  "小狗",
  "主人",
  "淫",
  "黄牌",
  "orgasm",
  "后颈",
  "aftercare",
  "password",
  "密码",
  "BACKSTAGE",
  "backstage",
  "骚",
  "屄",
  "肏",
  "鸡巴",
  "操她",
  "插",
  "射",
  "高潮",
] as const;
