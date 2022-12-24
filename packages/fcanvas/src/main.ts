import { ImageRepeat, Layer, loadImage, Stage } from "./"

const stage = new Stage({
  container: "app",
  width: 300,
  height: 300
})
const layer = new Layer()
stage.add(layer)

const img = new ImageRepeat({
  x: 0,
  y: 0,
  image: await loadImage(
    "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png"
  ),
  scrollWidth: stage.size.width,
  scrollHeight: stage.size.height,
  scrollLeft: -100
  // whileDraw:true
})
layer.add(img)
;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as unknown as any).img = img
