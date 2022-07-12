import { Shape } from "../Shape"

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type PersonalAttrs = {
  width: number
  height: number
  cornerRadius?: number | [number, number] | [number, number, number, number]
}

export class Rect extends Shape<PersonalAttrs> {
  static readonly type = "Rect"

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    if (this.attrs.cornerRadius) {
      // eslint-disable-next-line functional/no-let
      let r1 = 0
      // eslint-disable-next-line functional/no-let
      let r2 = 0
      // eslint-disable-next-line functional/no-let
      let r3 = 0
      // eslint-disable-next-line functional/no-let
      let r4 = 0
      const ws2 = this.attrs.width / 2
      const hs2 = this.attrs.height / 2
      if (typeof this.attrs.cornerRadius === "number") {
        r1 = Math.min(this.attrs.cornerRadius, ws2, hs2)
        r2 = r1
        r3 = r1
        r4 = r1
      } else if (this.attrs.cornerRadius.length === 2) {
        r1 = Math.min(this.attrs.cornerRadius[0], ws2, hs2)
        r3 = r1
        r2 = Math.min(this.attrs.cornerRadius[1], ws2, hs2)
        r4 = r2
      } else {
        ;[r1, r2, r3, r4] = [
          Math.min(this.attrs.cornerRadius[0], ws2, hs2),
          Math.min(this.attrs.cornerRadius[1], ws2, hs2),
          Math.min(this.attrs.cornerRadius[2], ws2, hs2),
          Math.min(this.attrs.cornerRadius[3], ws2, hs2)
        ]
      }

      context.moveTo(0, 0)
      context.arcTo(
        this.attrs.width,
        0,
        this.attrs.width,
        this.attrs.height - r2,
        r2
      )
      context.arcTo(
        this.attrs.width,
        this.attrs.height,
        this.attrs.width - r3,
        this.attrs.height,
        r3
      )
      context.arcTo(0, this.attrs.height, 0, this.attrs.height - r4, r4)
      context.arcTo(0, 0, this.attrs.width - r1, 0, r1)

      this.fillStrokeScene(context)
    } else {
      context.rect(0, 0, this.attrs.width, this.attrs.height)
      this.fillStrokeScene(context)
    }
  }
}
