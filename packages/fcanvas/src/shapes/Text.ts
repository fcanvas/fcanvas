import type { Group } from "../Group"
import type { Layer } from "../Layer"
import type { AttrsShapeSelf } from "../Shape"
import { Shape } from "../Shape"
import { Utils } from "../Utils"
import { transparent } from "../packages/Colors"
import type { Size } from "../types/Size"

import type { Label } from "./Label"

interface AttrsCustom {
  fontFamily?: string

  fontSize?: number

  fontStyle?: "normal" | "bold" | "italic" | "italic bold"

  fontVariant?: "normal" | "small-caps"

  textDecoration?: "line-through" | "underline" | ""

  text: string

  align?: "left" | "center" | "right" | "justify"

  verticalAlign?: "top" | "middle" | "bottom"

  padding?: number

  lineHeight?: number

  wrap?: "word" | "char" | "none"

  ellipsis?: boolean

  letterSpacing?: number

  width?: number | "auto"

  height?: number | "auto"
}

// eslint-disable-next-line functional/no-let
let dummyContext: CanvasRenderingContext2D
export function getDummyContext() {
  if (dummyContext) return dummyContext

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  dummyContext = Utils.createCanvas().getContext("2d")!
  return dummyContext
}

function normalizeFontFamily(fontFamily: string) {
  return fontFamily
    .split(",")
    .map((family) => {
      family = family.trim()
      const hasSpace = family.includes(" ")
      // eslint-disable-next-line quotes
      const hasQuotes = family.includes('"') || family.includes("'")
      if (hasSpace && !hasQuotes) family = `"${family}"`

      return family
    })
    .join(", ")
}

const ATTR_CHANGE_LIST: readonly (keyof AttrsCustom)[] = [
  "fontFamily",
  "fontSize",
  "fontStyle",
  "fontVariant",
  "padding",
  "align",
  "verticalAlign",
  "lineHeight",
  "text",
  "width",
  "height",
  "wrap",
  "ellipsis",
  "letterSpacing"
]
export class Text<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustom extends Record<string, any> = {},
  AttrsRefs extends Record<string, unknown> = Record<string, unknown>,
  AttrsRaws extends Record<string, unknown> = Record<string, unknown>
> extends Shape<
  AttrsCustom,
  EventsCustom,
  AttrsRefs,
  AttrsRaws,
  Layer | Group | Label
> {
  static readonly type = "Text"
  static readonly sizes = [
    "fontFamily",
    "fontSize",
    "fontStyle",
    "fontVariant",
    "textDecoration",
    "text",
    "align",
    "verticalAlign",
    "padding",
    "lineHeight",
    "wrap",
    "ellipsis",
    "letterSpacing"
  ]

  private textArr: Array<{
    text: string

    width: number

    lastInParagraph: boolean
  }> = []

  private partialTextX = 0

  private partialTextY = 0

  private partialText = ""

  private textWidth = 0
  constructor(attrs: AttrsShapeSelf<AttrsCustom, AttrsRefs, AttrsRaws>) {
    super(attrs)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.watch(ATTR_CHANGE_LIST as any, () => this.setTextData())
    this.setTextData()
  }

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    if (!this.attrs.text) return

    const textArr = this.textArr
    const textArrLen = textArr.length

    const { padding = 0, fontSize = 12 } = this.attrs
    const lineHeightPx = (this.attrs.lineHeight ?? 1) * fontSize
    const verticalAlign = this.attrs.verticalAlign
    const align = this.attrs.align
    const totalWidth = this.getWidth()
    const { letterSpacing } = this.attrs
    const fill = this.getFill(context)
    const textDecoration = this.attrs.textDecoration
    const shouldUnderline = textDecoration === "underline"
    const shouldLineThrough = textDecoration === "line-through"
    // eslint-disable-next-line functional/no-let
    let n
    let translateY = lineHeightPx / 2
    let alignY = 0

    // eslint-disable-next-line functional/immutable-data
    context.font = this.getContextFont()
    // eslint-disable-next-line functional/immutable-data
    context.textBaseline = "middle"
    // eslint-disable-next-line functional/immutable-data
    context.textAlign = "left"

    // handle vertical alignment
    if (verticalAlign === "middle")
      alignY = (this.getHeight() - textArrLen * lineHeightPx - padding * 2) / 2
    else if (verticalAlign === "bottom")
      alignY = this.getHeight() - textArrLen * lineHeightPx - padding * 2

    context.translate(padding, alignY + padding)

    // draw text lines

    for (n = 0; n < textArrLen; n++) {
      // eslint-disable-next-line functional/no-let
      let lineTranslateX = 0
      const lineTranslateY = 0
      const obj = textArr[n]
      const text = obj.text
      const width = obj.width
      const lastLine = obj.lastInParagraph

      // eslint-disable-next-line functional/no-let
      let spacesNumber, oneWord, lineWidth

      // horizontal alignment
      context.save()
      if (align === "right") lineTranslateX += totalWidth - width - padding * 2
      else if (align === "center")
        lineTranslateX += (totalWidth - width - padding * 2) / 2

      if (shouldUnderline) {
        context.save()
        context.beginPath()

        context.moveTo(
          lineTranslateX,
          translateY + lineTranslateY + Math.round(fontSize / 2)
        )
        spacesNumber = text.split(" ").length - 1
        oneWord = spacesNumber === 0
        lineWidth =
          align === "justify" && lastLine && !oneWord
            ? totalWidth - padding * 2
            : width
        context.lineTo(
          lineTranslateX + Math.round(lineWidth),
          translateY + lineTranslateY + Math.round(fontSize / 2)
        )

        // I have no idea what is real ratio
        // just /15 looks good enough
        // eslint-disable-next-line functional/immutable-data
        context.lineWidth = fontSize / 15
        // eslint-disable-next-line functional/immutable-data
        context.strokeStyle = fill ?? transparent
        context.stroke()
        context.restore()
      }
      if (shouldLineThrough) {
        context.save()
        context.beginPath()
        context.moveTo(lineTranslateX, translateY + lineTranslateY)
        spacesNumber = text.split(" ").length - 1
        oneWord = spacesNumber === 0
        lineWidth =
          align === "justify" && lastLine && !oneWord
            ? totalWidth - padding * 2
            : width
        context.lineTo(
          lineTranslateX + Math.round(lineWidth),
          translateY + lineTranslateY
        )
        // eslint-disable-next-line functional/immutable-data
        context.lineWidth = fontSize / 15
        // eslint-disable-next-line functional/immutable-data
        context.strokeStyle = fill ?? transparent
        context.stroke()
        context.restore()
      }
      if (letterSpacing !== 0 || align === "justify") {
        //   var words = text.split(' ');
        spacesNumber = text.split(" ").length - 1
        // eslint-disable-next-line functional/no-let
        for (let li = 0; li < text.length; li++) {
          const letter = text[li]
          // skip justify for the last line
          if (letter === " " && !lastLine && align === "justify")
            lineTranslateX += (totalWidth - padding * 2 - width) / spacesNumber
          // context.translate(
          //   Math.floor((totalWidth - padding * 2 - width) / spacesNumber),
          //   0
          // );

          this.partialTextX = lineTranslateX
          this.partialTextY = translateY + lineTranslateY
          this.partialText = letter
          this.fillStrokeScene(context)
          lineTranslateX +=
            this.measureSize(letter).width + (letterSpacing ?? 0)
        }
      } else {
        this.partialTextX = lineTranslateX
        this.partialTextY = translateY + lineTranslateY
        this.partialText = text

        this.fillStrokeScene(context)
      }
      context.restore()
      if (textArrLen > 1) translateY += lineHeightPx
    }
  }

  protected fillStrokeScene(context: CanvasRenderingContext2D) {
    // eslint-disable-next-line functional/immutable-data
    context.fillStyle = this.getFill(context) ?? "black"
    context.fillText(this.partialText, this.partialTextX, this.partialTextY)
    const _stroke = this.getStroke(context)
    if (_stroke !== void 0) {
      // eslint-disable-next-line functional/immutable-data
      context.strokeStyle = _stroke
      context.strokeText(this.partialText, this.partialTextX, this.partialTextY)
    }
  }

  private getWidth() {
    if (this.textWidth === void 0) this.setTextData()

    return this.attrs.width === "auto" || this.attrs.width === void 0
      ? this.textWidth + (this.attrs.padding ?? 0) * 2
      : this.attrs.width
  }

  private getHeight() {
    if (!this.textArr) this.setTextData()

    return this.attrs.height === "auto" || this.attrs.height === undefined
      ? (this.attrs.fontSize ?? 12) *
          this.textArr.length *
          (this.attrs.lineHeight ?? 1) +
          (this.attrs.padding ?? 0) * 2
      : (this.attrs.height as number)
  }

  private measureSize(text: string): Size {
    const _context = getDummyContext()
    const fontSize = this.attrs.fontSize ?? 12

    _context.save()
    // eslint-disable-next-line functional/immutable-data
    _context.font = this.getContextFont()

    const metrics = _context.measureText(text)
    _context.restore()
    return {
      width: metrics.width,
      height: fontSize
    }
  }

  public getContextFont() {
    return (
      (this.attrs.fontStyle ?? "normal") +
      " " +
      (this.attrs.fontVariant ?? "normal") +
      " " +
      ((this.attrs.fontSize ?? 12) + "px ") +
      // wrap font family into " so font families with spaces works ok
      normalizeFontFamily(this.attrs.fontFamily ?? "Arial")
    )
  }

  private addTextLine(line: string) {
    if (this.attrs.align === "justify") line = line.trim()

    const width = this.getTextWidth(line)

    return this.textArr.push({
      text: line,
      width,
      lastInParagraph: false
    })
  }

  private getTextWidth(text: string) {
    const letterSpacing = this.attrs.letterSpacing ?? 0
    const length = text.length
    return (
      getDummyContext().measureText(text).width +
      (length ? letterSpacing * (length - 1) : 0)
    )
  }

  private setTextData() {
    const lines = this.attrs.text.split("\n")
    const fontSize = this.attrs.fontSize ?? 12
    const lineHeightPx = (this.attrs.lineHeight ?? 1) * fontSize
    const width = this.attrs.width
    const height = this.attrs.height
    const fixedWidth = width !== "auto" && width !== undefined
    const fixedHeight = height !== "auto" && height !== undefined
    const padding = this.attrs.padding ?? 0
    const maxWidth = typeof width === "number" ? width - padding * 2 : NaN
    const maxHeightPx = typeof height === "number" ? height - padding * 2 : NaN
    const wrap = this.attrs.wrap
    // align = this.align(),
    const shouldWrap = wrap !== "none"
    const wrapAtWord = wrap !== "char" && shouldWrap
    const shouldAddEllipsis = this.attrs.ellipsis
    // eslint-disable-next-line functional/no-let
    let textWidth = 0
    let currentHeightPx = 0
    this.textArr = []
    this.textWidth = 0
    // eslint-disable-next-line functional/immutable-data
    getDummyContext().font = this.getContextFont()
    const additionalWidth = shouldAddEllipsis ? this.getTextWidth("…") : 0
    // eslint-disable-next-line functional/no-let
    for (let i = 0, max = lines.length; i < max; ++i) {
      // eslint-disable-next-line functional/no-let
      let line = lines[i]

      // eslint-disable-next-line functional/no-let
      let lineWidth = this.getTextWidth(line)
      if (fixedWidth && lineWidth > maxWidth) {
        /*
         * if width is fixed and line does not fit entirely
         * break the line into multiple fitting lines
         */

        while (line.length > 0) {
          /*
           * use binary search to find the longest substring that
           * that would fit in the specified width
           */
          // eslint-disable-next-line functional/no-let
          let low = 0
          let high = line.length
          let match = ""
          let matchWidth = 0

          while (low < high) {
            const mid = (low + high) >>> 1
            const substr = line.slice(0, mid + 1)
            const substrWidth = this.getTextWidth(substr) + additionalWidth
            if (substrWidth <= maxWidth) {
              low = mid + 1
              match = substr
              matchWidth = substrWidth
            } else {
              high = mid
            }
          }
          /*
           * 'low' is now the index of the substring end
           * 'match' is the substring
           * 'matchWidth' is the substring width in px
           */
          if (match) {
            // a fitting substring was found
            if (wrapAtWord) {
              // try to find a space or dash where wrapping could be done
              // eslint-disable-next-line functional/no-let
              let wrapIndex
              const nextChar = line[match.length]
              const nextIsSpaceOrDash = nextChar === " " || nextChar === "-"
              if (nextIsSpaceOrDash && matchWidth <= maxWidth) {
                wrapIndex = match.length
              } else {
                wrapIndex =
                  Math.max(match.lastIndexOf(" "), match.lastIndexOf("-")) + 1
              }
              if (wrapIndex > 0) {
                // re-cut the substring found at the space/dash position
                low = wrapIndex
                match = match.slice(0, low)
                matchWidth = this.getTextWidth(match)
              }
            }
            // if (align === 'right') {
            match = match.replace(/\s$/g, "")
            // }
            this.addTextLine(match)
            textWidth = Math.max(textWidth, matchWidth)
            currentHeightPx += lineHeightPx
            if (
              !shouldWrap ||
              (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx)
            ) {
              const lastLine = this.textArr[this.textArr.length - 1]
              if (lastLine) {
                if (shouldAddEllipsis) {
                  const haveSpace =
                    this.getTextWidth(lastLine.text + "…") < maxWidth
                  if (!haveSpace) {
                    // eslint-disable-next-line functional/immutable-data
                    lastLine.text = lastLine.text.slice(
                      0,
                      lastLine.text.length - 3
                    )
                  }

                  this.textArr.splice(this.textArr.length - 1, 1)
                  this.addTextLine(lastLine.text + "…")
                }
              }

              /*
               * stop wrapping if wrapping is disabled or if adding
               * one more line would overflow the fixed height
               */
              break
            }
            line = line.slice(low)
            line = line.replace(/^\s+/g, "")
            if (line.length > 0) {
              // Check if the remaining text would fit on one line
              lineWidth = this.getTextWidth(line)
              if (lineWidth <= maxWidth) {
                // if it does, add the line and break out of the loop
                this.addTextLine(line)
                currentHeightPx += lineHeightPx
                textWidth = Math.max(textWidth, lineWidth)
                break
              }
            }
          } else {
            // not even one character could fit in the element, abort
            break
          }
        }
      } else {
        // element width is automatically adjusted to max line width
        this.addTextLine(line)
        currentHeightPx += lineHeightPx
        textWidth = Math.max(textWidth, lineWidth)
      }
      // if element height is fixed, abort if adding one more line would overflow
      if (fixedHeight && currentHeightPx + lineHeightPx > maxHeightPx) break

      if (this.textArr[this.textArr.length - 1]) {
        // eslint-disable-next-line functional/immutable-data
        this.textArr[this.textArr.length - 1].lastInParagraph = true
      }
    }
    // var maxTextWidth = 0;
    // for(var j = 0; j < this.textArr.length; j++) {
    //     maxTextWidth = Math.max(maxTextWidth, this.textArr[j].width);
    // }
    this.textWidth = textWidth
  }

  protected size() {
    return {
      width: this.getWidth(),
      height: this.getHeight()
    }
  }
}
