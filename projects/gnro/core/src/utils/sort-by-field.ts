export function sortByField<T>(data: T[], field: string | Function, direction: string) {
  const order = direction === 'asc' ? 1 : -1;
  const isStringsArray = Array.isArray(data) && data.every((item) => typeof item === 'string');

  data.sort((d1, d2) => {
    const v1 = getSortValue(d1, field, isStringsArray);
    const v2 = getSortValue(d2, field, isStringsArray);
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
      res = v1! < v2! ? -1 : v1! > v2! ? 1 : 0;
    }
    return order * res;
  });
  return data;
}

function getSortValue<T>(data: T, field: string | Function, isStringsArray: boolean): string | null {
  if (isStringsArray) {
    return data as string;
  } else if (typeof field === 'function') {
    return field(data);
  } else {
    return (data as { [key: string]: string })[field];
  }
}
