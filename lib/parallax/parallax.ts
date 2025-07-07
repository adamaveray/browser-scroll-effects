type CssPropertyName = `--${string}`;

type AnchorX = 'left' | 'center' | 'right';
type AnchorY = 'top' | 'middle' | 'bottom';

type OrViewportAnchor<T extends string> = T | `viewport-${T}`;

export interface Options {
  /** The locations to measure an element’s relative parallax distance from. Unset axes will be ignored. */
  anchors: {
    x?: OrViewportAnchor<AnchorX> | undefined;
    y?: OrViewportAnchor<AnchorY> | undefined;
  };
  /** CSS custom property names to assign each element’s parallax values to. Unset axes will be ignored. */
  cssPropertyNames: {
    x?: CssPropertyName | undefined;
    y?: CssPropertyName | undefined;
  };
  /** The strength of the parallax effect. A larger value results in a greater parallax number at the extremes, while zero effectively disables the parallax effect. */
  strength: number;
  /** Whether to skip updates to the parallax value when the element is outside the viewport, to prevent unnecessary DOM and CSS updates. This can cause issues if combined with a high strength value. */
  ignoreOutsideViewport: boolean;
}

type Metrics = Record<AnchorX | AnchorY, number>;

interface ParallaxEntry extends Metrics, Options {
  element: HTMLElement;
}

const entries: ParallaxEntry[] = [];

const scrollMetrics: Metrics = {
  top: 0,
  bottom: 0,
  middle: 0,

  left: 0,
  right: 0,
  center: 0,
};

const getMiddle = (top: number, bottom: number): number => (top + bottom) / 2;

function measureElement(element: HTMLElement): Metrics {
  const rect = element.getBoundingClientRect();

  const top = scrollMetrics.top + rect.y;
  const bottom = top + rect.height;

  const left = scrollMetrics.left + rect.x;
  const right = left + rect.width;

  return {
    top,
    bottom,
    middle: getMiddle(top, bottom),
    left,
    right,
    center: getMiddle(left, right),
  };
}

function calculateEntryX(entry: ParallaxEntry): number | undefined {
  switch (entry.anchors.x) {
    case 'viewport-left': {
      return -scrollMetrics.left;
    }
    case 'viewport-center': {
      return -scrollMetrics.center;
    }
    case 'viewport-right': {
      return -scrollMetrics.right;
    }
    case 'left': {
      return entry.left - scrollMetrics.left;
    }
    case 'center': {
      return entry.center - scrollMetrics.center;
    }
    case 'right': {
      return entry.right - scrollMetrics.right;
    }
    case undefined: {
      return 0;
    }
  }
}

function calculateEntryY(entry: ParallaxEntry): number | undefined {
  switch (entry.anchors.y) {
    case 'viewport-top': {
      return -scrollMetrics.top;
    }
    case 'viewport-middle': {
      return -scrollMetrics.middle;
    }
    case 'viewport-bottom': {
      return -scrollMetrics.bottom;
    }
    case 'top': {
      return entry.top - scrollMetrics.top;
    }
    case 'middle': {
      return entry.middle - scrollMetrics.middle;
    }
    case 'bottom': {
      return entry.bottom - scrollMetrics.bottom;
    }
    case undefined: {
      return 0;
    }
  }
}

function setEntryAxis(
  entry: ParallaxEntry,
  propertyName: CssPropertyName | undefined,
  calculateAxisAmount: (entry: ParallaxEntry) => number | undefined,
): void {
  let value: number | undefined;
  if (propertyName == null || (value = calculateAxisAmount(entry)) == null) {
    return;
  }
  const amount = value * entry.strength;
  entry.element.style.setProperty(propertyName, String(amount));
}

function positionElement(entry: ParallaxEntry): void {
  if (entry.ignoreOutsideViewport && (entry.bottom < scrollMetrics.top || entry.top > scrollMetrics.bottom)) {
    // Out of view
    return;
  }

  setEntryAxis(entry, entry.cssPropertyNames.x, calculateEntryX);
  setEntryAxis(entry, entry.cssPropertyNames.y, calculateEntryY);
}

function handleResize(): void {
  for (const entry of entries) {
    Object.assign(entry, measureElement(entry.element));
    positionElement(entry);
  }
}

function handleScroll(): void {
  scrollMetrics.top = window.scrollY;
  scrollMetrics.bottom = window.scrollY + window.innerHeight;
  scrollMetrics.middle = getMiddle(scrollMetrics.top, scrollMetrics.bottom);

  scrollMetrics.left = window.scrollX;
  scrollMetrics.right = window.scrollX + window.innerWidth;
  scrollMetrics.center = getMiddle(scrollMetrics.left, scrollMetrics.right);

  for (const entry of entries) {
    positionElement(entry);
  }
}

export default function trackParallaxScrolling(element: HTMLElement, options: Options): void {
  trackParallaxScrolling.setup();

  const entry = { element, ...options, ...measureElement(element) } satisfies ParallaxEntry;
  entries.push(entry);
  positionElement(entry);
}
trackParallaxScrolling.isSetup = false;
trackParallaxScrolling.setup = function setupParallax(): void {
  if (this.isSetup) {
    return;
  }

  // Handle document resizes
  const resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(document.documentElement);
  handleResize();

  // Track scrolling
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  this.isSetup = true;
};
