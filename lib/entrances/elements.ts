import { onFirstIntersection } from '../utils/intersection.ts';

export interface ElementOptions {
  /** A class to add to an element when it has entered the viewport. */
  classEntered: string;
  /** Options to pass to the IntersectionObserver instance used to monitor entrance. */
  intersectionOptions?: IntersectionObserverInit;
}

export function enterElement(element: Element, className: ElementOptions['classEntered']): void {
  element.classList.add(className);
}

export default function setupElementEntrance(
  element: HTMLElement,
  { classEntered, intersectionOptions }: ElementOptions,
): void {
  onFirstIntersection(element, intersectionOptions, (target) => {
    enterElement(target, classEntered);
  });
}
