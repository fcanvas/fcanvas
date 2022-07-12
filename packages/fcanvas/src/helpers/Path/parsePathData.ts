import type { Offset } from "../../types/Offset"
import { convertEndpointToCenterParameterization } from "../convertEndpointToCenterParameterization"

import { calcLength } from "./calcLength"

export function parsePathData(data: string) {
  // Path Data Segment must begin with a moveTo
  // m (x y)+  Relative moveTo (subsequent points are treated as lineTo)
  // M (x y)+  Absolute moveTo (subsequent points are treated as lineTo)
  // l (x y)+  Relative lineTo
  // L (x y)+  Absolute LineTo
  // h (x)+    Relative horizontal lineTo
  // H (x)+    Absolute horizontal lineTo
  // v (y)+    Relative vertical lineTo
  // V (y)+    Absolute vertical lineTo
  // z (closepath)
  // Z (closepath)
  // c (x1 y1 x2 y2 x y)+ Relative Bezier curve
  // C (x1 y1 x2 y2 x y)+ Absolute Bezier curve
  // q (x1 y1 x y)+       Relative Quadratic Bezier
  // Q (x1 y1 x y)+       Absolute Quadratic Bezier
  // t (x y)+    Shorthand/Smooth Relative Quadratic Bezier
  // T (x y)+    Shorthand/Smooth Absolute Quadratic Bezier
  // s (x2 y2 x y)+       Shorthand/Smooth Relative Bezier curve
  // S (x2 y2 x y)+       Shorthand/Smooth Absolute Bezier curve
  // a (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+     Relative Elliptical Arc
  // A (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+  Absolute Elliptical Arc

  // return early if data is not defined
  if (!data) return []

  // command string
  // eslint-disable-next-line functional/no-let
  let cs = data

  // command chars
  const cc = [
    "m",
    "M",
    "l",
    "L",
    "v",
    "V",
    "h",
    "H",
    "z",
    "Z",
    "c",
    "C",
    "q",
    "Q",
    "t",
    "T",
    "s",
    "S",
    "a",
    "A"
  ]
  // convert white spaces to commas
  cs = cs.replace(/ /g, ",")
  // create pipes so that we can split the data
  // eslint-disable-next-line functional/no-let
  for (let n = 0; n < cc.length; n++)
    cs = cs.replace(new RegExp(cc[n], "g"), "|" + cc[n])

  // create array
  const arr = cs.split("|")

  const ca: {
    command: string

    points: number[]

    start?: Offset

    pathLength: number
  }[] = []
  const coords = []
  // init context point
  // eslint-disable-next-line functional/no-let
  let cpx = 0
  // eslint-disable-next-line functional/no-let
  let cpy = 0

  const re = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi
  // eslint-disable-next-line functional/no-let
  let match
  // eslint-disable-next-line functional/no-let
  for (let n = 1; n < arr.length; n++) {
    const str = arr[n].slice(1)
    // eslint-disable-next-line functional/no-let
    let c = arr[n][0]

    coords.splice(0)

    while ((match = re.exec(str))) coords.push(match[0])

    // while ((match = re.exec(str))) {
    //   coords.push(match[0]);
    // }
    const p = []

    // eslint-disable-next-line functional/no-let
    for (let j = 0, jlen = coords.length; j < jlen; j++) {
      // extra case for merged flags
      if (coords[j] === "00") {
        p.push(0, 0)
        continue
      }
      const parsed = parseFloat(coords[j])
      if (!isNaN(parsed)) p.push(parsed)
      else p.push(0)
    }

    while (p.length > 0) {
      if (isNaN(p[0])) {
        // case for a trailing comma before next command
        break
      }

      // eslint-disable-next-line functional/no-let
      let cmd = null
      // eslint-disable-next-line functional/no-let
      let points: number[] = []
      const startX = cpx
      const startY = cpy
      // Move var from within the switch to up here (jshint)
      // eslint-disable-next-line functional/no-let
      let prevCmd, ctlPtx, ctlPty // Ss, Tt
      // eslint-disable-next-line functional/no-let
      let rx, ry, psi, fa, fs, x1, y1 // Aa

      // convert l, H, h, V, and v to L
      switch (c) {
        // Note: Keep the lineTo's above the moveTo's in this switch
        case "l":
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpx += p.shift()!
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpy += p.shift()!
          cmd = "L"

          points.push(cpx, cpy)
          break
        case "L":
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpx = p.shift()!
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpy = p.shift()!

          points.push(cpx, cpy)
          break
        // Note: lineTo handlers need to be above this point
        case "m":
          // eslint-disable-next-line no-case-declarations, @typescript-eslint/no-non-null-assertion
          const dx = p.shift()!
          // eslint-disable-next-line no-case-declarations, @typescript-eslint/no-non-null-assertion
          const dy = p.shift()!
          cpx += dx
          cpy += dy
          cmd = "M"
          // After closing the path move the current position
          // to the the first point of the path (if any).
          if (ca.length > 2 && ca[ca.length - 1].command === "z") {
            // eslint-disable-next-line functional/no-let
            for (let idx = ca.length - 2; idx >= 0; idx--) {
              if (ca[idx].command === "M") {
                cpx = ca[idx].points[0] + dx
                cpy = ca[idx].points[1] + dy
                break
              }
            }
          }

          points.push(cpx, cpy)
          c = "l"
          // subsequent points are treated as relative lineTo
          break
        case "M":
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpx = p.shift()!
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpy = p.shift()!
          cmd = "M"

          points.push(cpx, cpy)
          c = "L"
          // subsequent points are treated as absolute lineTo
          break

        case "h":
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpx += p.shift()!
          cmd = "L"

          points.push(cpx, cpy)
          break
        case "H":
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpx = p.shift()!
          cmd = "L"

          points.push(cpx, cpy)
          break
        case "v":
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpy += p.shift()!
          cmd = "L"

          points.push(cpx, cpy)
          break
        case "V":
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpy = p.shift()!
          cmd = "L"

          points.push(cpx, cpy)
          break
        case "C":
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          points.push(p.shift()!, p.shift()!, p.shift()!, p.shift()!)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpx = p.shift()!
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpy = p.shift()!

          points.push(cpx, cpy)
          break
        case "c":
          points.push(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            cpx + p.shift()!,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            cpy + p.shift()!,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            cpx + p.shift()!,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            cpy + p.shift()!
          )
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpx += p.shift()!
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpy += p.shift()!
          cmd = "C"

          points.push(cpx, cpy)
          break
        case "S":
          ctlPtx = cpx
          ctlPty = cpy
          prevCmd = ca[ca.length - 1]
          if (prevCmd.command === "C") {
            ctlPtx = cpx + (cpx - prevCmd.points[2])
            ctlPty = cpy + (cpy - prevCmd.points[3])
          }
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          points.push(ctlPtx, ctlPty, p.shift()!, p.shift()!)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpx = p.shift()!
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpy = p.shift()!
          cmd = "C"

          points.push(cpx, cpy)
          break
        case "s":
          ctlPtx = cpx
          ctlPty = cpy
          prevCmd = ca[ca.length - 1]
          if (prevCmd.command === "C") {
            ctlPtx = cpx + (cpx - prevCmd.points[2])
            ctlPty = cpy + (cpy - prevCmd.points[3])
          }
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          points.push(ctlPtx, ctlPty, cpx + p.shift()!, cpy + p.shift()!)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpx += p.shift()!
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpy += p.shift()!
          cmd = "C"

          points.push(cpx, cpy)
          break
        case "Q":
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          points.push(p.shift()!, p.shift()!)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpx = p.shift()!
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpy = p.shift()!

          points.push(cpx, cpy)
          break
        case "q":
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          points.push(cpx + p.shift()!, cpy + p.shift()!)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpx += p.shift()!
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpy += p.shift()!
          cmd = "Q"

          points.push(cpx, cpy)
          break
        case "T":
          ctlPtx = cpx
          ctlPty = cpy
          prevCmd = ca[ca.length - 1]
          if (prevCmd.command === "Q") {
            ctlPtx = cpx + (cpx - prevCmd.points[0])
            ctlPty = cpy + (cpy - prevCmd.points[1])
          }
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpx = p.shift()!
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpy = p.shift()!
          cmd = "Q"

          points.push(ctlPtx, ctlPty, cpx, cpy)
          break
        case "t":
          ctlPtx = cpx
          ctlPty = cpy
          prevCmd = ca[ca.length - 1]
          if (prevCmd.command === "Q") {
            ctlPtx = cpx + (cpx - prevCmd.points[0])
            ctlPty = cpy + (cpy - prevCmd.points[1])
          }
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpx += p.shift()!
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpy += p.shift()!
          cmd = "Q"

          points.push(ctlPtx, ctlPty, cpx, cpy)
          break
        case "A":
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          rx = p.shift()!
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ry = p.shift()!
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          psi = p.shift()!
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          fa = p.shift()!
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          fs = p.shift()!
          x1 = cpx
          y1 = cpy
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpx = p.shift()!
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpy = p.shift()!
          cmd = "A"
          points = convertEndpointToCenterParameterization(
            x1,
            y1,
            cpx,
            cpy,
            fa,
            fs,
            rx,
            ry,
            psi
          )
          break
        case "a":
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          rx = p.shift()!
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ry = p.shift()!
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          psi = p.shift()!
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          fa = p.shift()!
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          fs = p.shift()!
          x1 = cpx
          y1 = cpy
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpx += p.shift()!
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cpy += p.shift()!
          cmd = "A"
          points = convertEndpointToCenterParameterization(
            x1,
            y1,
            cpx,
            cpy,
            fa,
            fs,
            rx,
            ry,
            psi
          )
          break
      }

      ca.push({
        command: cmd || c,
        points,
        start: {
          x: startX,
          y: startY
        },
        pathLength: calcLength(startX, startY, cmd || c, points)
      })
    }

    if (c === "z" || c === "Z") {
      ca.push({
        command: "z",
        points: [],
        start: undefined,
        pathLength: 0
      })
    }
  }

  return ca
}
