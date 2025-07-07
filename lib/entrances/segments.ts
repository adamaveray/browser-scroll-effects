import { onFirstIntersection } from '../utils/intersection.ts';
import { wrapSegments } from '../utils/segments.ts';
import type { WrapSegmentOptions } from '../utils/segments.ts';
import { stagger } from '../utils/timing.ts';

import type { ElementOptions } from './elements.ts';
import { enterElement } from './elements.ts';

export interface SegmentsOptions extends ElementOptions, WrapSegmentOptions {
  /** A duration in milliseconds to delay before entering the next segment within an element. */
  stepDelay: number;
  /** A class to add to elements with segments (regardless of whether the elements have entered or not). */
  classHasSegments: string;
  /** A class to add to an element after all its segments have finished entering. */
  classFinished: string;
  /** An element to wrap each segment in. The template element will be cloned for each segment, and the segment will be appended to it. */
  segmentWrapperTemplate: HTMLElement;
}

function enterSegments<T extends HTMLElement>(
  segments: T[],
  stepDelay: number,
  onEnter: (segment: T, index: number) => void,
  onLast: () => void,
): void {
  stagger(segments, stepDelay, onEnter, onLast);
}

export default function setupSegmentsEntrance(
  element: HTMLElement,
  {
    classHasSegments,
    classEntered,
    classFinished,
    stepDelay,
    segmentWrapperTemplate,
    intersectionOptions,
    ...options
  }: SegmentsOptions,
): void {
  // Process element
  const segments = wrapSegments(element, segmentWrapperTemplate, options) ?? [];

  // Set up entrance monitoring
  onFirstIntersection(element, intersectionOptions, () => {
    enterElement(element, classEntered);

    enterSegments(
      segments,
      stepDelay,
      (segment) => {
        enterElement(segment, classEntered);
      },
      () => {
        element.classList.add(classFinished);
      },
    );
  });

  // Add configured attributes
  element.classList.add(classHasSegments);
}
