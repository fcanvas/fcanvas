# Transform

An optional `transform` it is available in all system objects including [Stage](/guide/essentials/Stage), [Layer](/guide/essentials/Layer), [Shape](/guide/essentials/Shape) essentials/Shape) and their derived objects like [Arc](/guide/shapes/Arc)... and some special options like [fillPattern](/guide/essentials/Shape#fillPattern)...

```ts
interface TransformOptions {
  x?: number
  y?: number
  scale?: { x?: number; y?: number }
  rotation?: number
  offset?: { x?: number; y?: number }
  skewX?: number
  skewY?: number
}
```

If you are familiar with `CSS 3` you will find them familiar

Yes indeed `x`, `y` are alias of the [translate in CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate) function. and likewise I will explain them below

### offset and x, y

You will set them by setting `offset` it allows to shift the element by how many pixels

### scale

Magnify it how many times along the x and y axes.

It is the alias of [scale in CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale)

### rotation

How many degrees of rotation this unit is in `degress`

### skewX and skewY

Skew it by how many pixels in the x and y axes.

It is the alias of [skewX in CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skewX) and [skewY in CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skewY)
