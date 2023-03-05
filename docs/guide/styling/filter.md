# Filter

This option allows to apply powerful filters to the reference element here: https://developer.mozilla.org/en-US/docs/Web/CSS/filter

The options of `Filter` with the option [filter in CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/filter) are equivalent i'm making it exactly the same except that the value type must conform below:

```ts
interface Filter {
  url?: string // string
  blur?: number // px
  brightness?: number // int%
  contrast?: number // 0 -> 100%
  dropShadow?: {
    x?: number
    y?: number
    blur?: number // intpx > 0
    color: string
  }
  greyscale?: number // int%
  hueRotate?: number // 0 -> 360 deg
  invert?: number // int%
  opacity?: number // 0 -> 100%
  saturate?: number // int%
  sepia?: number // int%
}
```

The `filter` property is specified as `none` or one or more of the functions listed below. If the parameter for any function is invalid, the function returns `none`. Except where noted, the functions that take a value expressed with a percent sign (as in `34%`) also accept the value expressed as decimal (as in `0.34`).

When the `filter` property values contains multiple functions, the filters are applied in order.

### blur

Applies a Gaussian blur to the input image.

### brightness

Applies a linear multiplier to the input image, making it appear more or less bright. Values are linear multipliers on the effect, with `0%` creating a completely black image, `100%` having no effect, and values over `100%` brightening the image.

### contrast

Adjusts the contrast of the input image. A value of `0%` makes the image grey, `100%` has no effect, and values over `100%` create a contrast.

### dropShadow

```ts
interface DropShadow {
  x?: number
  y?: number
  blur?: number // intpx > 0
  color: string
}
```

Applies the parameter `<shadow>` as a drop shadow, following the contours of the image. The shadow syntax is similar to `<box-shadow>` (defined in the [CSS backgrounds and borders module](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Backgrounds_and_Borders)), with the exception that the `inset` keyword and `spread` parameter are not allowed. As with all `filter` property values, any filters after the `dropShadow` are applied to the shadow.

```ts
new Circle({
  filter: {
    dropShadow: {
      x: 16,
      y: 16,
      blur: 10,
      color: "back"
    }
  }
})
```

equal

```css
.circle {
  filter: drop-shadow(16px 16px 10px black);
}
```

### grayscale

Converts the image to grayscale. A value of `100%` is completely grayscale. The initial value of `0%` leaves the input unchanged. Values between `0%` and `100%` produce linear multipliers on the effect.

```ts
new Circle({
  filter: {
    grayscale: 100 //%
  }
})
```

equal

```css
.circle {
  filter: grayscale(100%);
}
```

### hueRotate

Applies a hue rotation. The `<angle>` value defines the number of degrees around the hue color circle at which the input samples will be adjusted. A value of `0deg` leaves the input unchanged.

```ts
new Circle({
  filter: {
    hueRotate: 90 //deg
  }
})
```

equal

```css
.circle {
  filter: hue-rotate(90deg);
}
```

### invert

Inverts the samples in the input image. A value of `100%` completely inverts the image. A value of `0%` leaves the input unchanged. Values between `0%` and `100%` have linear multipliers on the effect.

```ts
new Circle({
  filter: {
    invert: 100 //%
  }
})
```

equal

```css
.circle {
  filter: invert(100%);
}
```

### opacity

Applies transparency. `0%` makes the image completely transparent and `100%` leaves the image unchanged.

```ts
new Circle({
  filter: {
    opacity: 500 //%
  }
})
```

equal

```css
.circle {
  filter: opacity(50%);
}
```

### saturate

Saturates the image, with `0%` being completely unsaturated, `100%` leaving the image unchanged, and values of over `100%` increasing saturation.

### sepia

Converts the image to sepia, with a value of `100%` making the image completely sepia and `0%` making no change.
