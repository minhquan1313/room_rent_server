type isMatch = boolean;
type isBigger = boolean;

/**
 * @param arr
 * @param callback return array of [isMath,isBigger]
 * @param l
 * @param r
 * @returns index of target, -1 when not found
 */
export function binarySearch<T>(arr: T[], callback: (mid: T) => [isMatch, isBigger], l?: number, r?: number) {
  if (l === undefined) l = 0;
  if (r === undefined) r = arr.length - 1;

  if (r >= l) {
    const mid = Math.ceil(l + (r - l) / 2);

    const [isMatch, isBigger] = callback(arr[mid]);

    if (isMatch) return mid;

    // Nếu arr[mid] > x, thực hiện tìm kiếm nửa trái của mảng
    if (isBigger) return binarySearch(arr, callback, l, mid - 1);

    // Nếu arr[mid] < x, thực hiện tìm kiếm nửa phải của mảng
    return binarySearch(arr, callback, mid + 1, r);
  }

  return -1;
}
