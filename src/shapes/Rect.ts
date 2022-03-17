import { Shape } from "../Shape";

type AttrsCustom = {
  // eslint-disable-next-line functional/prefer-readonly-type
  width: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  height: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  cornerRadius?: number | [number, number] | [number, number, number, number];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
export class Rect<EventsCustom extends Record<string, any> = {}> extends Shape<
  AttrsCustom,
  EventsCustom
> {
  static readonly type = "Rect";

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    if (this.attrs.cornerRadius) {
      // eslint-disable-next-line functional/no-let
      let r1 = 0,
        r2 = 0,
        r3 = 0,
        r4 = 0;

      if (typeof this.attrs.cornerRadius === "number") {
        r1 = this.attrs.cornerRadius;
        r2 = r1;
        r3 = r1;
        r4 = r1;
      } else if (this.attrs.cornerRadius.length === 2) {
        r1 = this.attrs.cornerRadius[0];
        r3 = this.attrs.cornerRadius[0];
        r2 = this.attrs.cornerRadius[1];
        r4 = this.attrs.cornerRadius[1];
      } else {
        [r1, r2, r3, r4] = this.attrs.cornerRadius;
      }

      context.moveTo(0, 0);
      context.arcTo(
        this.attrs.width,
        0,
        this.attrs.width,
        this.attrs.height - r2,
        r2
      );
      context.arcTo(
        this.attrs.width,
        this.attrs.height,
        this.attrs.width - r3,
        this.attrs.height,
        r3
      );
      context.arcTo(0, this.attrs.height, 0, this.attrs.height - r4, r4);
      context.arcTo(0, 0, this.attrs.width - r1, 0, r1);

      this.fillStrokeScene(context);
    } else {
      context.rect(0, 0, this.attrs.width, this.attrs.height);
      this.fillStrokeScene(context);
    }
  }
}
