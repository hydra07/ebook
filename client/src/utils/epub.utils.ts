/**
 * Debounce
 * @param func Target function
 * @param timeout delay
 */
export function debounce<Params extends any[]>(
  timeout: number,
  func: (...args: Params) => any,
): (...args: Params) => void {
  let timer: NodeJS.Timeout;
  return (...args: Params) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}
/**
 * Split CFI range into two starting CFI and ending CFI
 * - null : Invalid CFIRange
 * @param cfiRange CFIRange
 * @return startCfi, endCfi | null
 */
export function cfiRangeSplitter(
  cfiRange: string,
): { startCfi: string; endCfi: string } | null {
  const content = cfiRange.slice(8, -1);
  const [origin, start, end] = content.split(',');

  if (!origin || !start || !end) return null;

  const startCfi = `epubcfi(${origin + start})`;
  const endCfi = `epubcfi(${origin + end})`;
  return { startCfi, endCfi };
}

