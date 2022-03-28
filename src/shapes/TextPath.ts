import { transparent } from "../packages/Colors";
import { Group } from "../Group";
import { Layer } from "../Layer";
import { AttrsShapeSelf, Shape } from "../Shape";
import { getLineLength } from "../helpers/Path/getLineLength";
import { getPointOnCubicBezier } from "../helpers/Path/getPointOnCubicBezier";
import { getPointOnEllipticalArc } from "../helpers/Path/getPointOnEllipticalArc";
import { getPointOnLine } from "../helpers/Path/getPointOnLine";
import { getPointOnQuadraticBezier } from "../helpers/Path/getPointOnQuadraticBezier";
import { parsePathData } from "../helpers/Path/parsePathData";
import { Offset } from "../types/Offset";

import { getDummyContext, Text } from "./Text";

type AttrsCustom = {
  // eslint-disable-next-line functional/prefer-readonly-type
  text: string;
  // eslint-disable-next-line functional/prefer-readonly-type
  data: string;
  // eslint-disable-next-line functional/prefer-readonly-type
  fontFamily?: string;
  // eslint-disable-next-line functional/prefer-readonly-type
  fontSize?: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  fontStyle?: string;
  // eslint-disable-next-line functional/prefer-readonly-type
  letterSpacing?: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  textDecoration?: "line-through" | "underline" | "";
  // eslint-disable-next-line functional/prefer-readonly-type
  fontVariant?: "normal" | "small-caps";
  // eslint-disable-next-line functional/prefer-readonly-type
  align?: "left" | "center" | "right" | "justify";
  // eslint-disable-next-line functional/prefer-readonly-type
  verticalAlign?: "top" | "middle" | "bottom";
  // eslint-disable-next-line functional/prefer-readonly-type
  padding?: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  lineHeight?: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  wrap?: "word" | "char" | "none";
  // eslint-disable-next-line functional/prefer-readonly-type
  ellipsis?: boolean;
  // eslint-disable-next-line functional/prefer-readonly-type
  width?: number | "auto";
  // eslint-disable-next-line functional/prefer-readonly-type
  height?: number | "auto";
  // eslint-disable-next-line functional/prefer-readonly-type
  textBaseline?: CanvasTextBaseline;
};

const EmptyObject = Object.freeze(Object.create(null));

export class TextPath<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustom extends Record<string, any> = {},
  AttrsRefs extends Record<string, unknown> = Record<string, unknown>,
  AttrsRaws extends Record<string, unknown> = Record<string, unknown>
> extends Shape<
  AttrsCustom,
  EventsCustom,
  AttrsRefs,
  AttrsRaws,
  Layer | Group
> {
  static readonly type = "TextPath";
  static readonly sizes = [
    "text",
    "data",
    "fontFamily",
    "fontSize",
    "fontStyle",
    "letterSpacing",
  ];

  // eslint-disable-next-line functional/prefer-readonly-type
  private dataArray: ReturnType<typeof parsePathData> = [];
  // eslint-disable-next-line functional/prefer-readonly-type
  private glyphInfo: {
    // eslint-disable-next-line functional/prefer-readonly-type
    transposeX: number;
    // eslint-disable-next-line functional/prefer-readonly-type
    transposeY: number;
    // eslint-disable-next-line functional/prefer-readonly-type
    text: string;
    // eslint-disable-next-line functional/prefer-readonly-type
    rotation: number;
    // eslint-disable-next-line functional/prefer-readonly-type
    p0: Offset;
    // eslint-disable-next-line functional/prefer-readonly-type
    p1: Offset;
  }[] = [];
  // eslint-disable-next-line functional/prefer-readonly-type
  private partialText = "";
  // eslint-disable-next-line functional/prefer-readonly-type
  private textWidth = 0;
  constructor(attrs: AttrsShapeSelf<AttrsCustom, AttrsRefs, AttrsRaws>) {
    super(attrs);

    this.dataArray = parsePathData(this.attrs.data);
    this.watch(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      TextPath.sizes as any,
      () => {
        this.dataArray = parsePathData(this.attrs.data);
      },
      {
        deep: true,
      }
    );
    this.watch("text", () => this.setTextData(), {
      immediate: true,
    });
  }

  protected fillStrokeScene(context: CanvasRenderingContext2D) {
    // eslint-disable-next-line functional/immutable-data
    context.fillStyle = this.getFill(context) ?? "black";
    context.fillText(this.partialText, 0, 0);
    const _stroke = this.getStroke(context);
    if (_stroke !== void 0) {
      // eslint-disable-next-line functional/immutable-data
      context.strokeStyle = _stroke;
      context.strokeText(this.partialText, 0, 0);
    }
  }
  protected _sceneFunc(context: CanvasRenderingContext2D) {
    // eslint-disable-next-line functional/immutable-data
    context.font = this.getContextFont();
    if (this.attrs.textBaseline) {
      // eslint-disable-next-line functional/immutable-data
      context.textBaseline = this.attrs.textBaseline;
    }
    // eslint-disable-next-line functional/immutable-data
    context.textAlign = "left";
    context.save();

    const textDecoration = this.attrs.textDecoration;
    const fill = this.getFill(context);
    const fontSize = this.attrs.fontSize ?? 12;

    const glyphInfo = this.glyphInfo;
    if (textDecoration === "underline") {
      context.beginPath();
    }
    // eslint-disable-next-line functional/no-loop-statement, functional/no-let
    for (let i = 0; i < glyphInfo.length; i++) {
      context.save();

      const p0 = glyphInfo[i].p0;

      context.translate(p0.x, p0.y);
      context.rotate(glyphInfo[i].rotation);
      this.partialText = glyphInfo[i].text;

      this.fillStrokeScene(context);
      if (textDecoration === "underline") {
        if (i === 0) {
          context.moveTo(0, fontSize / 2 + 1);
        }

        context.lineTo(fontSize, fontSize / 2 + 1);
      }
      context.restore();

      //// To assist with debugging visually, uncomment following
      //
      // if (i % 2) context.strokeStyle = 'cyan';
      // else context.strokeStyle = 'green';
      // var p1 = glyphInfo[i].p1;
      // context.moveTo(p0.x, p0.y);
      // context.lineTo(p1.x, p1.y);
      // context.stroke();
    }
    if (textDecoration === "underline") {
      // eslint-disable-next-line functional/immutable-data
      context.strokeStyle = fill ?? transparent;
      // eslint-disable-next-line functional/immutable-data
      context.lineWidth = fontSize / 20;
      context.stroke();
    }

    context.restore();
  }

  private getContextFont() {
    return Text.prototype.getContextFont.call(this);
  }

  private getTextSize(text: string) {
    const _context = getDummyContext();

    _context.save();

    // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
    _context.font = this.getContextFont()!;
    const metrics = _context.measureText(text);

    _context.restore();

    return {
      width: metrics.width,
      height: parseInt((this.attrs.fontSize ?? 12) + "", 10),
    };
  }
  private setTextData() {
    const size = this.getTextSize(this.attrs.text);
    const letterSpacing = this.attrs.letterSpacing ?? 0;
    const align = this.attrs.align;
    // const kerningFunc = null

    this.textWidth = size.width;
    // this.textHeight = size.height;

    const textFullWidth = Math.max(
      this.textWidth + ((this.attrs.text || "").length - 1) * letterSpacing,
      0
    );

    this.glyphInfo = [];

    // eslint-disable-next-line functional/no-let
    let fullPathWidth = 0;
    // eslint-disable-next-line functional/no-loop-statement,functional/no-let
    for (let l = 0; l < this.dataArray.length; l++) {
      if (this.dataArray[l].pathLength > 0) {
        fullPathWidth += this.dataArray[l].pathLength;
      }
    }

    // eslint-disable-next-line functional/no-let
    let offset = 0;
    if (align === "center") {
      offset = Math.max(0, fullPathWidth / 2 - textFullWidth / 2);
    }
    if (align === "right") {
      offset = Math.max(0, fullPathWidth - textFullWidth);
    }

    const charArr = this.attrs.text;
    const spacesNumber = charArr.split(" ").length - 1;

    // eslint-disable-next-line functional/no-let
    let p0: Offset | void,
      p1: Offset | void,
      pathCmd: typeof this.dataArray[0] | void,
      pIndex = -1,
      currentT = 0;
    // var sumLength = 0;
    // for(var j = 0; j < that.dataArray.length; j++) {
    //   if(that.dataArray[j].pathLength > 0) {
    //
    //     if (sumLength + that.dataArray[j].pathLength > offset) {}
    //       fullPathWidth += that.dataArray[j].pathLength;
    //   }
    // }

    const getNextPathSegment = () => {
      currentT = 0;
      const pathData = this.dataArray;

      // eslint-disable-next-line functional/no-loop-statement,functional/no-let
      for (let j = pIndex + 1; j < pathData.length; j++) {
        if (pathData[j].pathLength > 0) {
          pIndex = j;

          return pathData[j];
        } else if (pathData[j].command === "M") {
          p0 = {
            x: pathData[j].points[0],
            y: pathData[j].points[1],
          };
        }
      }

      return EmptyObject;
    };

    const findSegmentToFitCharacter = (c: string): void => {
      // eslint-disable-next-line functional/no-let
      let glyphWidth = this.getTextSize(c).width + letterSpacing;

      if (c === " " && align === "justify") {
        glyphWidth += (fullPathWidth - textFullWidth) / spacesNumber;
      }

      // eslint-disable-next-line functional/no-let
      let currLen = 0;
      // eslint-disable-next-line functional/no-let
      let attempts = 0;

      p1 = void 0;
      // eslint-disable-next-line functional/no-loop-statement
      while (
        Math.abs(glyphWidth - currLen) / glyphWidth > 0.01 &&
        attempts < 20
      ) {
        attempts++;
        // eslint-disable-next-line functional/no-let
        let cumulativePathLength = currLen;
        // eslint-disable-next-line functional/no-loop-statement
        while (pathCmd === undefined) {
          pathCmd = getNextPathSegment();

          if (
            pathCmd &&
            cumulativePathLength + pathCmd.pathLength < glyphWidth
          ) {
            cumulativePathLength += pathCmd.pathLength;
            pathCmd = void 0;
          }
        }

        if (pathCmd === EmptyObject || p0 === undefined) {
          return undefined;
        }

        // eslint-disable-next-line functional/no-let
        let needNewSegment = false;

        switch (pathCmd?.command) {
          case "L":
            if (
              getLineLength(p0.x, p0.y, pathCmd.points[0], pathCmd.points[1]) >
              glyphWidth
            ) {
              p1 = getPointOnLine(
                glyphWidth,
                p0.x,
                p0.y,
                pathCmd.points[0],
                pathCmd.points[1],
                p0.x,
                p0.y
              );
            } else {
              pathCmd = void 0;
            }
            break;
          case "A":
            // eslint-disable-next-line no-case-declarations
            const start = pathCmd.points[4];
            // 4 = theta
            // eslint-disable-next-line no-case-declarations
            const dTheta = pathCmd.points[5];
            // 5 = dTheta
            // eslint-disable-next-line no-case-declarations
            const end = pathCmd.points[4] + dTheta;

            if (currentT === 0) {
              currentT = start + 0.00000001;
            } else if (glyphWidth > currLen) {
              // Just in case start is 0
              currentT += ((Math.PI / 180.0) * dTheta) / Math.abs(dTheta);
            } else {
              currentT -= ((Math.PI / 360.0) * dTheta) / Math.abs(dTheta);
            }

            // Credit for bug fix: @therth https://github.com/ericdrowell/KonvaJS/issues/249
            // Old code failed to render text along arc of this path: "M 50 50 a 150 50 0 0 1 250 50 l 50 0"
            if (
              (dTheta < 0 && currentT < end) ||
              (dTheta >= 0 && currentT > end)
            ) {
              currentT = end;
              needNewSegment = true;
            }
            p1 = getPointOnEllipticalArc(
              pathCmd.points[0],
              pathCmd.points[1],
              pathCmd.points[2],
              pathCmd.points[3],
              currentT,
              pathCmd.points[6]
            );
            break;
          case "C":
            if (currentT === 0) {
              if (glyphWidth > pathCmd.pathLength) {
                currentT = 0.00000001;
              } else {
                currentT = glyphWidth / pathCmd.pathLength;
              }
            } else if (glyphWidth > currLen) {
              currentT += (glyphWidth - currLen) / pathCmd.pathLength / 2;
            } else {
              currentT = Math.max(
                currentT - (currLen - glyphWidth) / pathCmd.pathLength / 2,
                0
              );
            }

            if (currentT > 1.0) {
              currentT = 1.0;
              needNewSegment = true;
            }
            p1 = getPointOnCubicBezier(
              currentT,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              pathCmd.start!.x,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              pathCmd.start!.y,
              pathCmd.points[0],
              pathCmd.points[1],
              pathCmd.points[2],
              pathCmd.points[3],
              pathCmd.points[4],
              pathCmd.points[5]
            );
            break;
          case "Q":
            if (currentT === 0) {
              currentT = glyphWidth / pathCmd.pathLength;
            } else if (glyphWidth > currLen) {
              currentT += (glyphWidth - currLen) / pathCmd.pathLength;
            } else {
              currentT -= (currLen - glyphWidth) / pathCmd.pathLength;
            }

            if (currentT > 1.0) {
              currentT = 1.0;
              needNewSegment = true;
            }
            p1 = getPointOnQuadraticBezier(
              currentT,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              pathCmd.start!.x,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              pathCmd.start!.y,
              pathCmd.points[0],
              pathCmd.points[1],
              pathCmd.points[2],
              pathCmd.points[3]
            );
            break;
        }

        if (p1 != null) {
          currLen = getLineLength(p0.x, p0.y, p1.x, p1.y);
        }

        if (needNewSegment) {
          needNewSegment = false;
          pathCmd = void 0;
        }
      }
    };

    // fake search for offset, this is the best approach
    const testChar = "C";
    const glyphWidth = this.getTextSize(testChar).width + letterSpacing;
    const lettersInOffset = offset / glyphWidth - 1;
    // the idea is simple
    // try to draw testChar until we fill offset
    // eslint-disable-next-line functional/no-loop-statement, functional/no-let
    for (let k = 0; k < lettersInOffset; k++) {
      findSegmentToFitCharacter(testChar);
      if (p0 === undefined || p1 === undefined) {
        break;
      }
      p0 = p1;
    }

    // eslint-disable-next-line functional/no-loop-statement, functional/no-let
    for (let i = 0; i < charArr.length; i++) {
      // Find p1 such that line segment between p0 and p1 is approx. width of glyph
      findSegmentToFitCharacter(charArr[i]);

      if (p0 === undefined || p1 === undefined) {
        break;
      }

      const width = getLineLength(p0.x, p0.y, p1.x, p1.y);

      const kern = 0;
      //   if (kerningFunc) {
      //     try {
      //       // getKerning is a user provided getter. Make sure it never breaks our logic
      //       kern = kerningFunc(charArr[i - 1], charArr[i]) * this.fontSize();
      //     } catch (e) {
      //       kern = 0;
      //     }
      //   }

      // eslint-disable-next-line functional/immutable-data
      p0.x += kern;
      // eslint-disable-next-line functional/immutable-data
      p1.x += kern;
      this.textWidth += kern;

      const midpoint = getPointOnLine(
        kern + width / 2.0,
        p0.x,
        p0.y,
        p1.x,
        p1.y
      );

      const rotation = Math.atan2(p1.y - p0.y, p1.x - p0.x);
      // eslint-disable-next-line functional/immutable-data
      this.glyphInfo.push({
        transposeX: midpoint.x,
        transposeY: midpoint.y,
        text: charArr[i],
        rotation: rotation,
        p0: p0,
        p1: p1,
      });
      p0 = p1;
    }
  }
  public getSelfRect() {
    if (!this.glyphInfo.length) {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
    }
    // eslint-disable-next-line functional/prefer-readonly-type
    const points: number[] = [];

    this.glyphInfo.forEach((info) => {
      // eslint-disable-next-line functional/immutable-data
      points.push(info.p0.x);
      // eslint-disable-next-line functional/immutable-data
      points.push(info.p0.y);
      // eslint-disable-next-line functional/immutable-data
      points.push(info.p1.x);
      // eslint-disable-next-line functional/immutable-data
      points.push(info.p1.y);
    });
    // eslint-disable-next-line functional/no-let
    let minX = points[0] || 0;
    // eslint-disable-next-line functional/no-let
    let maxX = points[0] || 0;
    // eslint-disable-next-line functional/no-let
    let minY = points[1] || 0;
    // eslint-disable-next-line functional/no-let
    let maxY = points[1] || 0;
    // eslint-disable-next-line functional/no-let
    let x, y;
    // eslint-disable-next-line functional/no-loop-statement, functional/no-let
    for (let i = 0; i < points.length / 2; i++) {
      x = points[i * 2];
      y = points[i * 2 + 1];
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    const fontSize = this.attrs.fontSize || 12;
    return {
      x: minX - fontSize / 2,
      y: minY - fontSize / 2,
      width: maxX - minX + fontSize,
      height: maxY - minY + fontSize,
    };
  }
}
