import { CONFIGS } from "../configs"

// by https://jsfiddle.net/casamia743/xqh48gno/
function calcProjectedRectSizeOfRotatedRect(
  width: number,
  height: number,
  rad: number
): readonly [number, number] {
  const rectProjectedWidth: number =
    Math.abs(width * Math.cos(rad)) + Math.abs(height * Math.sin(rad))
  const rectProjectedHeight: number =
    Math.abs(width * Math.sin(rad)) + Math.abs(height * Math.cos(rad))

  return [rectProjectedWidth, rectProjectedHeight]
}

export function cropImage(
  image: CanvasImageSource,
  x = 0,
  y = 0,
  width: number = image.width as number,
  height: number = image.height as number,
  rotate = 0
): HTMLCanvasElement {
  const virualContext = CONFIGS.createContext2D()

  /// ------------------ draw image canvas -----------------
  const rad: number = (rotate * Math.PI) / 180
  const [swidth, sheight] = calcProjectedRectSizeOfRotatedRect(
    width,
    height,
    rad
  )

  virualContext.canvas.width = width

  virualContext.canvas.height = height

  if (rotate !== 0) {
    virualContext.save()
    virualContext.translate(width / 2, height / 2)
    virualContext.rotate(rad)
  }
  virualContext.drawImage(
    image,
    x,
    y,
    swidth,
    sheight,
    rotate ? -swidth / 2 : 0,
    rotate ? -sheight / 2 : 0,
    swidth,
    sheight
  )
  if (rotate !== 0) virualContext.restore()

  /// -----------------------------------------------------------

  return virualContext.canvas
}
