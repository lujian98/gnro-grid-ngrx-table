// https://github.com/epoberezkin/fast-deep-equal#readme
export function isEqual<T>(a: T, b: T) {
  if (a === b) {
    return true;
  }

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) {
      return false;
    }

    let length, i;

    if (Array.isArray(a) && Array.isArray(b)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0; ) if (!isEqual(a[i], b[i])) return false;
      return true;
    } else if (a instanceof RegExp && b instanceof RegExp) {
      return a.source === b.source && a.flags === b.flags;
    } else if (a.valueOf !== Object.prototype.valueOf) {
      return a.valueOf() === b.valueOf();
    } else if (a.toString !== Object.prototype.toString) {
      return a.toString() === b.toString();
    }

    const keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) {
      return false;
    }

    for (i = length; i-- !== 0; ) {
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) {
        return false;
      }
    }

    for (i = length; i-- !== 0; ) {
      const key = keys[i];
      if (!isEqual((a as { [index: string]: T })[key], (b as { [index: string]: T })[key])) {
        return false;
      }
    }
    return true;
  }

  // true if both NaN, false otherwise
  return a !== a && b !== b;
}
