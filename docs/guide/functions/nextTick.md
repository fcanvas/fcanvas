# nextTick

A utility for waiting for the next fcanvas update flush.

Because `fcanvas` automatically applies drawing reduction strategies, in many cases when there is a change, `Group` will not redraw immediately, but wait until the batch change is complete.

If you want to get the image immediately in the process you have to call `await nextTick()`

- **Type**

```ts
function nextTick(callback?: () => void): Promise<void>
```

- **Details**

When you mutate reactive state in Vue, the resulting DOM updates are not applied synchronously. Instead, Vue buffers them until the "next tick" to ensure that each component updates only once no matter how many state changes you have made.

`nextTick()` can be used immediately after a state change to wait for the DOM updates to complete. You can either pass a callback as an argument, or await the returned Promise.

- **Example**

```ts
const stage = new Stage({
  autoDraw: false
})
const layer = new Layer()
const group = new Group()
const circle = new Circle({
  x: stage.size.width / 2,
  y: stage.size.height / 2,
  radius: 70,
  fill: "red"
})

group.add(circle)
layer.add(group)
stage.add(layer)

circle.$.opacity = 0.5
layer.draw()

circle.$.opacity = 1
layer.draw()

console.log(toCanvas(layer).toDataURL()) // empty image

await nextTick()

console.log(toCanvas(layer).toDataURL()) // image url
```
