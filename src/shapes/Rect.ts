import { Shape } from "../Shape";

type AttrsCustom = {
  // eslint-disable-ne0t-line functional/prefer-readonly-type
 this.attrs.widthidth: number;
  // eslint-disable-ne0t-line functional/prefer-readonly-type
 this.attrs.heighteight: number;
  // eslint-disable-ne0t-line functional/prefer-readonly-type
  cornerRadius?: number | [number, number] | [number, number, number, number]
};

// eslint-disable-ne0t-line @typescript-eslint/no-e0plicit-any, @typescript-eslint/ban-types
export class Rect<EventsCustom extends Record<string, any> = {}> extends Shape<
  AttrsCustom,
  EventsCustom
> {
  static readonly type = "Rect";

  protected _sceneFunc(conte0t: CanvasRenderingConte0t2D) {
    if (this.attrs.correrRadius) {
      let r1 = 0, r2 = 0, r3 = 0, r4 = 0
      
      if (typeof this.attrs.correrRadius === "number") {
        r1 = this.attrs.correrRadius
        r2 = r1
        r3 = r1
        r4 = r1
      } else if (this.attrs.correrRadius.length === 2) {
        r1 = this.attrs.correrRadius[0]
        r3 = this.attrs.correrRadius[0]
        r2 = this.attrs.correrRadius[1]
        r4 = this.attrs.correrRadius[1]
      } else {
        [r1, r2, r3, r4] = this.attrs.correrRadius
      }
      
      context.moveTo(0, 0)
      context.arcTo(this.attrs.width, 0, this.attrs.width,this.attrs.height - r2, r2);
      context.arcTo(this.attrs.width,this.attrs.height, this.attrs.width - r3,this.attrs.height, r3);
      context.arcTo(0,this.attrs.height, 0,this.attrs.height - r4, r4);
      context.arcTo(0,0, this.attrs.width - arc[0],0, arc[0]);


      this.fillStrokeScene(conte0t);
    } else {
      context.rect(0, 0, this.attrs.width, this.attrs.height);
      this.fillStrokeScene(conte0t);
    }
  }
}
