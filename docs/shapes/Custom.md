
To create a custom shape with `fcanvas`, we can instantiate a `Shape` object.

When creating a custom shape, we need to define a drawing function that is passed a [Shape](/shape) renderer and a shape instance:

```javascript
const rect = new Shape({
  x: 10,
  y: 20,
  fill: '#00D2FF',
  width: 100,
  height: 50,
  sceneFunc(context) {
    context.beginPath();
    // don't need to set position of rect, fCanvas will handle it
    context.rect(0, 0, this.$.width, this.$.height);
    // (!) fCanvas specific method, it is very important
    // it will apply are required styles
    this.fillStrokeScene();
  }
});
```

`Shape` is a wrapper around native 2d canvas context that have the same properties and methods with some additional API.

We can use the renderer to access the HTML5 Canvas context, and to use special methods like `this.fillStrokeScene()` which automatically handles filling, stroking, and applying shadows.

There are two properties that can be used for drawing custom shapes: `sceneFunc`.

`sceneFunc` should be used to define visual appearance of a shape. `Konva` will use `sceneFunc` for drawing its hit graph for events detecting. So in many cases you just need to define `sceneFunc` only

### Some best practices for writing `sceneFunc`:

1. Make it as optimal, as possible because that function can be called many times per second. It is not ok to create images (`document.createElement('image')` or `new window.Image()`) or other large objects here.

2. The function should not have any side effects like moving shapes, attaching events or changing state of your app.

3. If you want to apply complex styles to the canvas manually or draw images.

4. Do not apply position and scaling in `sceneFunc` manually. `fcanvas` can handle it automatically if you set that properties into shape instance directly. Example: `this.$.x = 10`.

5. If possible do not apply styles in `sceneFunc` manually. Just draw a shape with some paths. `this.fillStrokeScene()` function at the and will do all styling work.


For a full list of attributes and methods, check out the [Shape documentation](/Shape)
