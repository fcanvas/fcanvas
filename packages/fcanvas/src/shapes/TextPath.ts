import type { ComputedRef } from "@vue/reactivity"
import { computed } from "@vue/reactivity"

import { Shape } from "../Shape"
import { watchEffect } from "../fns/watch"
import { getLineLength } from "../helpers/Path/getLineLength"
import { getPointOnCubicBezier } from "../helpers/Path/getPointOnCubicBezier"
import { getPointOnEllipticalArc } from "../helpers/Path/getPointOnEllipticalArc"
import { getPointOnLine } from "../helpers/Path/getPointOnLine"
import { getPointOnQuadraticBezier } from "../helpers/Path/getPointOnQuadraticBezier"
import { parsePathData } from "../helpers/Path/parsePathData"
import { SCOPE } from "../symbols"
import type { CommonShapeAttrs } from "../type/CommonShapeAttrs"
import type { Offset } from "../type/Offset"
import type { TorFnT } from "../type/TorFnT"
import type { ReactiveType } from "../type/fn/ReactiveType"

import { getContextFont, getDummyContext } from "./Text"

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type PersonalAttrs = {
  text: string
  data: string
  fontFamily?: string
  fontSize?: number
  fontStyle?: string
  fontVariant?: "normal" | "small-caps"
  textDecoration?: "line-through" | "underline" | "none"
  align?: "left" | "center" | "right" | "justify"
  letterSpacing?: number

  textBaseline?: CanvasTextBaseline
}

const EmptyObject = Object.freeze(Object.create(null))

export class TextPath extends Shape<PersonalAttrs> {
  static readonly type = "TextPath"

  private readonly dataArray: ComputedRef<ReturnType<typeof parsePathData>>

  private readonly glyphInfo: {
    transposeX: number
    transposeY: number
    text: string
    rotation: number
    p0: Offset
    p1: Offset
  }[] = []

  private partialText = ""

  private textWidth = 0

  constructor(
    attrs: TorFnT<ReactiveType<CommonShapeAttrs<PersonalAttrs>>, TextPath>
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super(attrs as unknown as any, "post")

    this[SCOPE].fOn()
    this.dataArray = computed(() => parsePathData(this.$.data))
    watchEffect(() => this.setTextData())
    this[SCOPE].fOff()
  }

  protected fillStrokeScene(context: CanvasRenderingContext2D) {
    context.fillStyle = this.getFill(context) ?? "black"
    context.fillText(this.partialText, 0, 0)
    const _stroke = this.getStroke(context)
    if (_stroke !== undefined) {
      context.strokeStyle = _stroke
      context.strokeText(this.partialText, 0, 0)
    }
  }

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    context.font = getContextFont(this.$)
    if (this.$.textBaseline) context.textBaseline = this.$.textBaseline

    context.textAlign = "left"
    context.save()

    const textDecoration = this.$.textDecoration
    const fill = this.getFill(context)
    const fontSize = this.$.fontSize ?? 12

    const glyphInfo = this.glyphInfo
    if (textDecoration === "underline") context.beginPath()

    // eslint-disable-next-line functional/no-let
    for (let i = 0; i < glyphInfo.length; i++) {
      context.save()

      const p0 = glyphInfo[i].p0

      context.translate(p0.x, p0.y)
      context.rotate(glyphInfo[i].rotation)
      this.partialText = glyphInfo[i].text

      this.fillStrokeScene(context)
      if (textDecoration === "underline") {
        if (i === 0) context.moveTo(0, fontSize / 2 + 1)

        context.lineTo(fontSize, fontSize / 2 + 1)
      }
      context.restore()

      /// / To assist with debugging visually, uncomment following
      //
      // if (i % 2) context.strokeStyle = 'cyan';
      // else context.strokeStyle = 'green';
      // var p1 = glyphInfo[i].p1;
      // context.moveTo(p0.x, p0.y);
      // context.lineTo(p1.x, p1.y);
      // context.stroke();
    }
    if (textDecoration === "underline") {
      context.strokeStyle = fill ?? "transparent"

      context.lineWidth = fontSize / 20
      context.stroke()
    }

    context.restore()
  }

  private getTextSize(text: string) {
    const _context = getDummyContext()

    _context.save()

    _context.font = getContextFont(this.$)
    const metrics = _context.measureText(text)

    _context.restore()

    return {
      width: metrics.width,
      height: parseInt((this.$.fontSize ?? 12) + "", 10)
    }
  }

  private setTextData() {
    const size = this.getTextSize(this.$.text)
    const letterSpacing = this.$.letterSpacing ?? 0
    const align = this.$.align
    // const kerningFunc = null

    this.textWidth = size.width
    // this.textHeight = size.height;

    const textFullWidth = Math.max(
      this.textWidth + ((this.$.text || "").length - 1) * letterSpacing,
      0
    )

    this.glyphInfo.splice(0)

    // eslint-disable-next-line functional/no-let
    let fullPathWidth = 0
    // eslint-disable-next-line functional/no-let
    for (let l = 0; l < this.dataArray.value.length; l++) {
      if (this.dataArray.value[l].pathLength > 0)
        fullPathWidth += this.dataArray.value[l].pathLength
    }

    // eslint-disable-next-line functional/no-let
    let offset = 0
    if (align === "center")
      offset = Math.max(0, fullPathWidth / 2 - textFullWidth / 2)

    if (align === "right") offset = Math.max(0, fullPathWidth - textFullWidth)

    const charArr = this.$.text
    const spacesNumber = charArr.split(" ").length - 1

    // eslint-disable-next-line functional/no-let
    let p0: Offset | void
    // eslint-disable-next-line functional/no-let
    let p1: Offset | void
    // eslint-disable-next-line functional/no-let
    let pathCmd: (typeof this.dataArray.value)[0] | void
    // eslint-disable-next-line functional/no-let
    let pIndex = -1
    // eslint-disable-next-line functional/no-let
    let currentT = 0
    // var sumLength = 0;
    // for(var j = 0; j < that.dataArray.length; j++) {
    //   if(that.dataArray[j].pathLength > 0) {
    //
    //     if (sumLength + that.dataArray[j].pathLength > offset) {}
    //       fullPathWidth += that.dataArray[j].pathLength;
    //   }
    // }

    const getNextPathSegment = () => {
      currentT = 0
      const pathData = this.dataArray.value

      // eslint-disable-next-line functional/no-let
      for (let j = pIndex + 1; j < pathData.length; j++) {
        if (pathData[j].pathLength > 0) {
          pIndex = j

          return pathData[j]
        } else if (pathData[j].command === "M") {
          p0 = {
            x: pathData[j].points[0],
            y: pathData[j].points[1]
          }
        }
      }

      return EmptyObject
    }

    const findSegmentToFitCharacter = (c: string): void => {
      // eslint-disable-next-line functional/no-let
      let glyphWidth = this.getTextSize(c).width + letterSpacing

      if (c === " " && align === "justify")
        glyphWidth += (fullPathWidth - textFullWidth) / spacesNumber

      // eslint-disable-next-line functional/no-let
      let currLen = 0
      // eslint-disable-next-line functional/no-let
      let attempts = 0

      p1 = undefined

      while (
        Math.abs(glyphWidth - currLen) / glyphWidth > 0.01 &&
        attempts < 20
      ) {
        attempts++
        // eslint-disable-next-line functional/no-let
        let cumulativePathLength = currLen

        while (pathCmd === undefined) {
          pathCmd = getNextPathSegment()

          if (
            pathCmd &&
            cumulativePathLength + pathCmd.pathLength < glyphWidth
          ) {
            cumulativePathLength += pathCmd.pathLength
            pathCmd = undefined
          }
        }

        if (pathCmd === EmptyObject || p0 === undefined) return undefined

        // eslint-disable-next-line functional/no-let
        let needNewSegment = false

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
              )
            } else {
              pathCmd = undefined
            }
            break
          case "A":
            // eslint-disable-next-line no-case-declarations
            const start = pathCmd.points[4]
            // 4 = theta
            // eslint-disable-next-line no-case-declarations
            const dTheta = pathCmd.points[5]
            // 5 = dTheta
            // eslint-disable-next-line no-case-declarations
            const end = pathCmd.points[4] + dTheta

            if (currentT === 0) {
              currentT = start + 0.00000001
            } else if (glyphWidth > currLen) {
              // Just in case start is 0
              currentT += ((Math.PI / 180.0) * dTheta) / Math.abs(dTheta)
            } else {
              currentT -= ((Math.PI / 360.0) * dTheta) / Math.abs(dTheta)
            }

            // Credit for bug fix: @therth https://github.com/ericdrowell/KonvaJS/issues/249
            // Old code failed to render text along arc of this path: "M 50 50 a 150 50 0 0 1 250 50 l 50 0"
            if (
              (dTheta < 0 && currentT < end) ||
              (dTheta >= 0 && currentT > end)
            ) {
              currentT = end
              needNewSegment = true
            }
            p1 = getPointOnEllipticalArc(
              pathCmd.points[0],
              pathCmd.points[1],
              pathCmd.points[2],
              pathCmd.points[3],
              currentT,
              pathCmd.points[6]
            )
            break
          case "C":
            if (currentT === 0) {
              if (glyphWidth > pathCmd.pathLength) currentT = 0.00000001
              else currentT = glyphWidth / pathCmd.pathLength
            } else if (glyphWidth > currLen) {
              currentT += (glyphWidth - currLen) / pathCmd.pathLength / 2
            } else {
              currentT = Math.max(
                currentT - (currLen - glyphWidth) / pathCmd.pathLength / 2,
                0
              )
            }

            if (currentT > 1.0) {
              currentT = 1.0
              needNewSegment = true
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
            )
            break
          case "Q":
            if (currentT === 0) currentT = glyphWidth / pathCmd.pathLength
            else if (glyphWidth > currLen)
              currentT += (glyphWidth - currLen) / pathCmd.pathLength
            else currentT -= (currLen - glyphWidth) / pathCmd.pathLength

            if (currentT > 1.0) {
              currentT = 1.0
              needNewSegment = true
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
            )
            break
        }

        if (p1 != null) currLen = getLineLength(p0.x, p0.y, p1.x, p1.y)

        if (needNewSegment) {
          needNewSegment = false
          pathCmd = undefined
        }
      }
    }

    // fake search for offset, this is the best approach
    const testChar = "C"
    const glyphWidth = this.getTextSize(testChar).width + letterSpacing
    const lettersInOffset = offset / glyphWidth - 1
    // the idea is simple
    // try to draw testChar until we fill offset
    // eslint-disable-next-line functional/no-let
    for (let k = 0; k < lettersInOffset; k++) {
      findSegmentToFitCharacter(testChar)
      if (p0 === undefined || p1 === undefined) break

      p0 = p1
    }

    // eslint-disable-next-line functional/no-let
    for (let i = 0; i < charArr.length; i++) {
      // Find p1 such that line segment between p0 and p1 is approx. width of glyph
      findSegmentToFitCharacter(charArr[i])

      if (p0 === undefined || p1 === undefined) break

      const width = getLineLength(p0.x, p0.y, p1.x, p1.y)

      const kern = 0
      //   if (kerningFunc) {
      //     try {
      //       // getKerning is a user provided getter. Make sure it never breaks our logic
      //       kern = kerningFunc(charArr[i - 1], charArr[i]) * this.fontSize();
      //     } catch (e) {
      //       kern = 0;
      //     }
      //   }

      p0.x += kern

      p1.x += kern
      this.textWidth += kern

      const midpoint = getPointOnLine(
        kern + width / 2.0,
        p0.x,
        p0.y,
        p1.x,
        p1.y
      )

      const rotation = Math.atan2(p1.y - p0.y, p1.x - p0.x)

      this.glyphInfo.push({
        transposeX: midpoint.x,
        transposeY: midpoint.y,
        text: charArr[i],
        rotation,
        p0,
        p1
      })
      p0 = p1
    }
  }

  public getRect() {
    if (!this.glyphInfo.length) {
      return {
        x: 0,
        y: 0,
        width: 300,
        height: 300
      }
    }

    const points: number[] = []

    this.glyphInfo.forEach((info) => {
      points.push(info.p0.x, info.p0.y, info.p1.x, info.p1.y)
    })
    // eslint-disable-next-line functional/no-let
    let minX = points[0] || 0
    // eslint-disable-next-line functional/no-let
    let maxX = points[0] || 0
    // eslint-disable-next-line functional/no-let
    let minY = points[1] || 0
    // eslint-disable-next-line functional/no-let
    let maxY = points[1] || 0
    // eslint-disable-next-line functional/no-let
    let x, y
    // eslint-disable-next-line functional/no-let
    for (let i = 0; i < points.length / 2; i++) {
      x = points[i * 2]
      y = points[i * 2 + 1]
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
    }
    const fontSize = this.$.fontSize || 12
    return {
      x: minX - fontSize / 2,
      y: minY - fontSize / 2,
      width: maxX - minX + fontSize,
      height: maxY - minY + fontSize
    }
  }
}
