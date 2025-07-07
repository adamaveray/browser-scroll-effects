export function onFirstIntersection<T extends HTMLElement>(
  element: T,
  options: IntersectionObserverInit | undefined,
  fn: (element: T) => void,
): IntersectionObserver | undefined {
  const observer = new IntersectionObserver((entries, innerObserver) => {
    const [entry] = entries as [entry: IntersectionObserverEntry];
    if (entry.isIntersecting) {
      innerObserver.unobserve(entry.target);
      fn(entry.target as T);
    }
  }, options);
  observer.observe(element);
  return observer;
}
