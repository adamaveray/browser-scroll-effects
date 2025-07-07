import setupElementEntrance from './entrances/elements.ts';
import type { ElementOptions } from './entrances/elements.ts';
import setupSegmentsEntrance from './entrances/segments.ts';
import type { SegmentsOptions } from './entrances/segments.ts';
import type { RequiredOptions } from './utils/types.ts';

type Options = ElementOptions & SegmentsOptions;

const defaults = {
  classHasSegments: '__segmented',
  classEntered: '__entered',
  classFinished: '__finished',

  segmentWrapperTemplate: (() => {
    const template = document.createElement('span');
    template.className = 'segment';
    template.setAttribute('role', 'text');
    return template;
  })(),
} satisfies Partial<Options>;

export function element(
  target: HTMLElement,
  options: RequiredOptions<ElementOptions, keyof typeof defaults & keyof ElementOptions> = {},
): void {
  setupElementEntrance(target, { ...defaults, ...options });
}

export function segments(
  target: HTMLElement,
  options: RequiredOptions<SegmentsOptions, keyof typeof defaults & keyof SegmentsOptions>,
): void {
  setupSegmentsEntrance(target, { ...defaults, ...options });
}
