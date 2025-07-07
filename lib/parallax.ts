import innerTrackParallaxScrolling from './parallax/parallax.ts';
import type { Options } from './parallax/parallax.ts';
import type { RequiredOptions } from './utils/types.ts';

const defaults = {
  anchors: {
    x: 'center',
    y: 'middle',
  },
  cssPropertyNames: {
    y: '--parallax',
  },
  strength: 0.5, // eslint-disable-line @typescript-eslint/no-magic-numbers -- Default value.
  ignoreOutsideViewport: true,
} satisfies Partial<Options>;

export default function trackParallaxScrolling(
  element: HTMLElement,
  options: RequiredOptions<Options, keyof typeof defaults> = {},
): void {
  innerTrackParallaxScrolling(element, { ...defaults, ...options });
}
