/* eslint-disable n/no-path-concat */
import "./test/setup-environment"

// import { createCanvas } from "canvas"

import { Image, Layer, loadImage, Stage } from ".."

// import { save } from "./save"
import { compareLayerWithImage } from "./test/helpers/compareLayerWithImage"

describe("Image", () => {
  // ======================================================
  test("add image", async () => {
    const stage = new Stage({ autoDraw: false })

    const layer = new Layer()
    const darth = new Image({
      x: 0,
      y: 0,
      image: await loadImage(__dirname + "/test/assets/ellipse.png"),
      width: 100,
      height: 100,
      offset: { x: 50, y: 30 },
      crop: { x: 135, y: 7, width: 167, height: 134 }
    })

    layer.add(darth)
    stage.add(layer)

    darth.$.width = 200
    layer.draw()

    darth.$.width = 100
    layer.draw()

    expect(await compareLayerWithImage(layer, "image.png")).toBe(true)
  })

  // // ======================================================
  // test("crop and scale image", async () => {
  //   const stage = new Stage({ autoDraw: false })
  //   const layer = new Layer()
  //   const darth = new Image({
  //     x: 200,
  //     y: 75,
  //     image: await loadImage(__dirname + "/test/assets/image_fill_pattern.png"),
  //     width: 107,
  //     height: 75,
  //     crop: { x: 186, y: 211, width: 106, height: 74 },
  //     scale: { x: 0.5, y: 0.5 }
  //   })

  //   layer.add(darth)
  //   stage.add(layer)

  //   layer.draw()

  //   save(layer, "image_crop_scale")
  // })

  // // ======================================================
  // test("image with opacity and shadow", function (done) {
  //   loadImage("darth-vader.jpg", (imageObj) => {
  //     const stage = new Stage({ autoDraw: false })

  //     const layer = new Layer()
  //     const darth = new Image({
  //       x: 200,
  //       y: 60,
  //       image: imageObj,
  //       width: 100,
  //       height: 100,
  //       offset: { x: 50, y: 30 },
  //       draggable: true,
  //       opacity: 0.5,
  //       shadowColor: "black",
  //       shadowBlur: 10,
  //       shadowOpacity: 0.1,
  //       shadowOffset: { x: 20, y: 20 }
  //     })

  //     layer.add(darth)
  //     stage.add(layer)

  //     const trace = layer.getContext().getTrace()

  //     if (isBrowser) {
  //       assert.equal(
  //         trace,
  //         "clearRect(0,0,578,200);save();transform(1,0,0,1,150,30);globalAlpha=0.5;shadowColor=rgba(0,0,0,0.1);shadowBlur=10;shadowOffsetX=20;shadowOffsetY=20;drawImage([object HTMLImageElement],0,0,100,100);restore();"
  //       )
  //     } else {
  //       assert.equal(
  //         trace,
  //         "clearRect(0,0,578,200);save();transform(1,0,0,1,150,30);globalAlpha=0.5;shadowColor=rgba(0,0,0,0.1);shadowBlur=10;shadowOffsetX=20;shadowOffsetY=20;drawImage([object Object],0,0,100,100);restore();"
  //       )
  //     }

  //     done()
  //   })
  // })

  // // ======================================================
  // test("image with stroke, opacity and shadow", function (done) {
  //   loadImage("darth-vader.jpg", (imageObj) => {
  //     const stage = new Stage({ autoDraw: false })

  //     const layer = new Layer()
  //     const darth = new Image({
  //       x: 200,
  //       y: 60,
  //       image: imageObj,
  //       width: 100,
  //       height: 100,
  //       offset: { x: 50, y: 30 },
  //       draggable: true,
  //       opacity: 0.5,
  //       shadowColor: "black",
  //       shadowBlur: 10,
  //       shadowOpacity: 0.5,
  //       shadowOffset: { x: 20, y: 20 },
  //       stroke: "red",
  //       strokeWidth: 20
  //     })

  //     layer.add(darth)
  //     stage.add(layer)

  //     const trace = layer.getContext().getTrace()

  //     if (isBrowser) {
  //       assert.equal(
  //         trace,
  //         "clearRect(0,0,578,200);save();shadowColor=rgba(0,0,0,0.5);shadowBlur=10;shadowOffsetX=20;shadowOffsetY=20;globalAlpha=0.5;drawImage([object HTMLCanvasElement],0,0,578,200);restore();"
  //       )
  //     } else {
  //       assert.equal(
  //         trace,
  //         "clearRect(0,0,578,200);save();shadowColor=rgba(0,0,0,0.5);shadowBlur=10;shadowOffsetX=20;shadowOffsetY=20;globalAlpha=0.5;drawImage([object Object],0,0,578,200);restore();"
  //       )
  //     }

  //     done()
  //   })
  // })

  // // ======================================================
  // test("image caching", function (done) {
  //   loadImage("darth-vader.jpg", (imageObj) => {
  //     const stage = new Stage({ autoDraw: false })
  //     const layer = new Layer()
  //     const darth = new Image({
  //       x: 200,
  //       y: 60,
  //       image: imageObj,
  //       width: 100,
  //       height: 100,
  //       draggable: true
  //     })

  //     darth.cache()
  //     layer.add(darth)
  //     stage.add(layer)

  //     assert.deepEqual(darth.getSelfRect(), {
  //       x: 0,
  //       y: 0,
  //       width: 100,
  //       height: 100
  //     })

  //     const canvas = createCanvas()
  //     const context = canvas.getContext("2d")
  //     context.drawImage(imageObj, 200, 60, 100, 100)
  //     compareLayerAndCanvas(layer, canvas, 10)
  //     done()
  //   })
  // })

  // test("image loader", function (done) {
  //   if (isNode) {
  //     done()
  //     return
  //   }
  //   loadImage("darth-vader.jpg", (img) => {
  //     const stage = new Stage({ autoDraw: false })
  //     const layer = new Layer()
  //     stage.add(layer)
  //     const src = img.src
  //     Image.fromURL(src, function (image) {
  //       layer.add(image)
  //       layer.draw()
  //       assert.equal(image instanceof Image, true)
  //       const nativeImg = image.image()
  //       assert.equal(nativeImg instanceof Image, true)
  //       assert.equal(nativeImg.src.indexOf(src) !== -1, true)
  //       assert.equal(nativeImg.complete, true)
  //       done()
  //     })
  //   })
  // })

  // test("check loading failure", function (done) {
  //   const stage = new Stage({ autoDraw: false })
  //   const layer = new Layer()
  //   stage.add(layer)
  //   const src = "non-existent.jpg"
  //   Image.fromURL(src, null, function (e) {
  //     done()
  //   })
  // })

  // test("check zero values", function (done) {
  //   loadImage("darth-vader.jpg", (imageObj) => {
  //     const stage = new Stage({ autoDraw: false })
  //     const layer = new Layer()
  //     stage.add(layer)

  //     const image = new Image({ image: imageObj })
  //     layer.add(image)

  //     image.width(0)
  //     image.height(0)
  //     layer.draw()

  //     assert.equal(image.width(), 0)
  //     assert.equal(image.height(), 0)
  //     done()
  //   })
  // })

  // test("corner radius", function (done) {
  //   loadImage("darth-vader.jpg", (imageObj) => {
  //     const stage = new Stage({ autoDraw: false })

  //     const layer = new Layer()
  //     const darth = new Image({
  //       x: 20,
  //       y: 20,
  //       image: imageObj,
  //       cornerRadius: 10,
  //       draggable: true,
  //       stroke: "red",
  //       strokeWidth: 100,
  //       strokeEnabled: false
  //     })

  //     layer.add(darth)
  //     stage.add(layer)

  //     assert.equal(
  //       layer.getContext().getTrace(true),
  //       "clearRect();save();transform();beginPath();moveTo();lineTo();arc();lineTo();arc();lineTo();arc();lineTo();arc();closePath();clip();drawImage();restore();"
  //     )

  //     done()
  //   })
  // })
})
