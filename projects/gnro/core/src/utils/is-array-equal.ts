export function isArrayEqual<T extends { id: string }>(original: Array<T>, modified: Array<T>): boolean {
  if (Array.isArray(original) && Array.isArray(modified) && original?.length === modified?.length) {
    return original.every((o) => modified.some((m) => m.id === o.id));
  }
  return false;
}
