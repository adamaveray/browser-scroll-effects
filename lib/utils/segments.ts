const patternWhitespace = /^\s+$/u;
const isWhitespace = (string: string): boolean => patternWhitespace.test(string);

function wrapNodeWords(
  segmenter: Intl.Segmenter,
  combineSegments: boolean,
  node: Node,
  wrapperTemplate: Element,
): Node[] {
  const text = node.textContent ?? '';
  const newNodes: Node[] = [];

  // Process each segment
  const segments = [...segmenter.segment(text)];
  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i]?.segment ?? '';
    if (segment === '') {
      continue;
    }

    if (isWhitespace(segment)) {
      // Whitespace only
      newNodes.push(new Text(segment));
      continue;
    }

    // Non-whitespace – wrap
    const wrapper = wrapperTemplate.cloneNode(true) as HTMLElement;
    wrapper.textContent = segment;
    if (combineSegments) {
      // Combine all subsequent non-whitespace segments
      let nextSegment: string | undefined;
      while (i < segments.length && (nextSegment = segments[i + 1]?.segment) != null && !isWhitespace(nextSegment)) {
        wrapper.textContent += nextSegment;
        // eslint-disable-next-line sonarjs/updated-loop-counter -- Need to advance outer loop.
        i += 1;
      }
    }
    newNodes.push(wrapper);
  }

  // Restore wrapping whitespace
  /* eslint-disable sonarjs/slow-regex -- Best way to access surrounding whitespace. */
  const prefix = text.match(/^\s+/u)?.[0];
  const suffix = text.match(/\s+$/u)?.[0];
  /* eslint-enable sonarjs/slow-regex -- Best way to access surrounding whitespace. */
  if (prefix != null) {
    newNodes.unshift(new Text(prefix));
  }
  if (suffix != null) {
    newNodes.push(new Text(suffix));
  }

  return newNodes;
}

export type WrapSegmentOptions = Intl.SegmenterOptions & {
  /** Locales for `Intl.Segmenter`. */
  locales?: Intl.LocalesArgument;
  /** Whether to merge adjacent segments not separated by whitespace (e.g. to combine actual words with punctuation for word segmentation). This will result in a single segment for locales that do not use whitespace (e.g. `ja-JP`) so should be set dependent on the locale. */
  combineSegments?: boolean;
};
/**
 * Wraps each word in the given element with a wrapping element, to allow styling individually.
 *
 * @param element An element to process segments within. Only segments within direct Text child nodes will be processed.
 * @param wrapperTemplate An element that will be cloned for each segment. Each clone will have its `textContent` set to the segment text.
 * @param root0 Segmentation options.
 * @param root0.combineSegments Whether to merge adjacent segments not separated by whitespace (e.g. to combine actual words with punctuation for word segmentation). This will result in a single segment for locales that do not use whitespace (e.g. `ja-JP`) so should be set dependent on the locale.
 * @param root0.locales Locales for `Intl.Segmenter`.
 * @param root0.options All other standard options for `Intl.Segmenter`.
 * @returns The wrappers for each segment.
 */
export function wrapSegments<TWrapper extends Element>(
  element: Element,
  wrapperTemplate: TWrapper,
  { combineSegments = false, locales, ...options }: WrapSegmentOptions = {},
): TWrapper[] | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Gracefully support legacy browsers.
  if (typeof Intl === 'undefined' || Intl.Segmenter == null) {
    // Unsupported
    return undefined;
  }

  const segmenter = new Intl.Segmenter(locales, options);

  const nodes = [...element.childNodes]; // Must convert to a fixed array first as `childNodes` is a live list so will cause an infinite loop if iterated directly while adding nodes
  const segments: TWrapper[] = [];
  for (const node of nodes) {
    if (node instanceof Text) {
      // Prepend new processed nodes
      for (const newNode of wrapNodeWords(segmenter, combineSegments, node, wrapperTemplate)) {
        node.before(newNode);
        if (newNode instanceof Element) {
          segments.push(newNode as TWrapper);
        }
      }
      // Remove unprocessed node
      node.remove();
    }
  }
  return segments;
}
