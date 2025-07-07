/**
 * Applies a function to a collection of items, delaying each subsequent by a specified duration.
 *
 * @param items Items to apply a function to.
 * @param stepDelay A duration to delay each subsequent call by (in milliseconds).
 * @param fn A function that will be called with each item.
 * @param onFinish A function to call after the final iteration.
 */
export function stagger<T>(
  items: Iterable<T>,
  stepDelay: number,
  fn: (item: T, index: number) => void,
  onFinish: () => void,
): void {
  let index = 0;
  let lastIndex = index;
  for (const item of items) {
    const thisIndex = index;
    lastIndex = index;
    // eslint-disable-next-line @typescript-eslint/no-loop-func -- The lastIndex value is _supposed_ to change.
    setTimeout(() => {
      fn(item, thisIndex);
      if (thisIndex === lastIndex) {
        onFinish();
      }
    }, index * stepDelay);
    index += 1;
  }
}
