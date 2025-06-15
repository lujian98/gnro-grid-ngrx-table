export function sortByField<T>(data: T[], field: string, direction: string) {
  const order = direction === 'asc' ? 1 : -1;
  const isStringsArray = Array.isArray(data) && data.every((item) => typeof item === 'string');

  data.sort(function (d1: T, d2: T) {
    const v1 = isStringsArray ? d1 : (d1 as { [key: string]: string })[field];
    const v2 = isStringsArray ? d2 : (d2 as { [key: string]: string })[field];
    let res = null;
    if (v1 == null && v2 != null) {
      res = -1;
    } else if (v1 != null && v2 == null) {
      res = 1;
    } else if (v1 == null && v2 == null) {
      res = 0;
    } else if (typeof v1 === 'string' && typeof v2 === 'string') {
      res = v1.localeCompare(v2);
    } else {
      res = v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
    }
    return order * res;
  });
  return data;
}
