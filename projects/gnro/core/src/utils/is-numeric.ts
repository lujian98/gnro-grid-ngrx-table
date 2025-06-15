export function isNumeric(val: string | number | undefined): boolean {
  if (typeof val === 'number') {
    return true;
  } else if (typeof val === 'string') {
    return !isNaN(parseInt(val as string)) && !isNaN(parseFloat(val as string));
  } else {
    return false;
  }
}
