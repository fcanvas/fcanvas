import { Shape } from "../Shape";

type AttrsCustom = {
  // eslint-disable-next-line functional/prefer-readonly-type
  width: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  height: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  cornerRadius?: number | [number, number] | [number, number, number, number]
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
export class Rect<EventsCustom extends Record<string, any> = {}> extends Shape<
  AttrsCustom,
  EventsCustom
> {
  static readonly type = "Rect";

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    context.rect(0, 0, this.attrs.width, this.attrs.height);
    this.fillStrokeScene(context);
  }
}
