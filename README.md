# @averay/scroll-effects

Utilities to manage common scroll-based effects in browsers.

## Features

### Entrances

Element entrances add a class to elements when they first enter the viewport, supporting a CSS-defined entrance transition.

```ts
import { entrances } from '@averay/scroll-effects';

// Basic element entrance
entrances.element(document.getElementById('hero'), { classEntered: '__entered' });

// Word-by-word entrance
entrances.segments(document.getElementById('title'), {
  classEntered: '__entered',
  stepDelay: 50,
  // All `Intl.Segmenter` options can be used
  locales: ['en-AU'],
  granularity: 'word',
  combineSegments: true,
});
```

The following example CSS styles apply simple entrance effects triggered by the example script:

```css
@media (scripting: enabled) {
  /* Basic element entrance */
  #hero {
    transition: opacity 0.2s;

    &:not(.__entered) {
      opacity: 0;
    }
  }

  /* Segmented entrance */
  #title {
    /* Basic element entrance functionality is inherited */
    transition: opacity 0.2s;

    &:not(.__entered) {
      opacity: 0;
    }

    /* Segments can be animated individually. */
    > .segment {
      transition:
        opacity 0.2s,
        transform 0.2s;

      &:not(.__entered) {
        opacity: 0;
        transform: translateY(-0.2em);
      }
    }
  }
}
```

All entrance effects require support for [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver), and segment entrances require support for [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter). As `IntersectionObserver` is a baseline-available interface, an error will occur if used on an unsupported browser. `Intl.Segmenter` is a newly-baseline-available interface, however will not cause an error and not have segmentation applied, with element-level entrance effects continuing.

### Parallax

Parallax effects set a CSS custom property value on elements based on a scroll offset from a relative position (e.g. the viewport centre from the element’s centre), which can then be used to adjust the element’s position in CSS.

```ts
import { trackParallaxScrolling } from '@averay/scroll-effects';

for (const element of document.querySelectorAll<HTMLElement>('.feature')) {
  trackParallaxScrolling(element);
}

// Custom options
trackParallaxScrolling(document.getElementById('hero'), {
  anchors: { y: 'viewport-top' },
  strength: 2,
  cssPropertyNames: { y: '--offset' },
});
```

The following example CSS styles apply parallax effects controlled by the example script:

```css
.feature {
  transform: translateY(calc(1px * var(--parallax, 0)));
}

#hero {
  transform: translateY(calc(1px * var(--offset, 0)));
}
```

Parallax effects require support for [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver). As this is a baseline-available interface, an error will occur if used on an unsupported browser.

---

[MIT Licenced](./LICENCE)
