import "./style.scss"
// eslint-disable-next-line n/no-unpublished-import
import { Circle, Layer, Line, map, range, Stage, Text } from "../../../src"

const stage = new Stage({
  width: 302,
  height: 302,
  container: "app"
})

const [CENTER_X, CENTER_Y] = [151, 151]
const face = new Layer({
  x: 7,
  y: 7
})
stage.add(face)

// face.add(
//   new Circle({
//     x: CENTER_X,
//     y: CENTER_Y,
//     radius: 150,
//     stroke: "#4d4b63"
//   })
// );

// draw number for face clock
for (const num of range(0, 12)) {
  const angle = map(num!, 0, 12, 0, Math.PI * 2)

  const [x, y] = [
    CENTER_X + 125 * Math.sin(angle),
    CENTER_X - 125 * Math.cos(angle)
  ]

  const text = new Text({
    x,
    y,
    text: (num || 12) + "",
    fontSize: 25,
    fontFamily: "Orbitron",
    align: "center",
    verticalAlign: "middle",
    fill: num! % 3 ? "#4d4b63" : "#1df52f"
  })
  // eslint-disable-next-line functional/immutable-data
  text.attrs.x -= text.getClientRect().width / 2
  // eslint-disable-next-line functional/immutable-data
  text.attrs.y -= text.getClientRect().height / 2

  face.add(text)
}
// draw line for face clock
for (const i of range(0, 60)) {
  const angle = map(i!, 0, 60, 0, Math.PI * 2)

  const a = i! % 15 ? 145 : 140
  const [xStart, yStart, xStop, yStop] = [
    CENTER_X + a * Math.sin(angle),
    CENTER_Y + a * Math.cos(angle),
    CENTER_X + 150 * Math.sin(angle),
    CENTER_Y + 150 * Math.cos(angle)
  ]

  face.add(
    new Line({
      x: 0,
      y: 0,
      points: [xStart, yStart, xStop, yStop],
      stroke: i! % 15 ? "#4d4b63" : "#1df52f",
      strokeWidth: i! % 15 ? 1 : 3,
      lineCap: "round",
      lineJoin: "round"
    })
  )
}

const clockwises = new Layer()
stage.add(clockwises)

const wiseHour = /* 250 */ new Line({
  x: 0,
  y: 0,
  points: [CENTER_X, CENTER_Y],
  stroke: "#61afff",
  strokeWidth: 3,
  lineCap: "round",
  lineJoin: "round"
})
clockwises.add(wiseHour)

const wiseMinus = /* 290 */ new Line({
  x: 0,
  y: 0,
  points: [CENTER_X, CENTER_Y],
  stroke: "#61afff",
  strokeWidth: 3,
  lineCap: "round",
  lineJoin: "round"
})
clockwises.add(wiseMinus)

const wiseSecond = /* 295 */ new Line({
  x: 0,
  y: 0,
  points: [CENTER_X, CENTER_Y],
  stroke: "#ee791a",
  strokeWidth: 2,
  lineCap: "round",
  lineJoin: "round"
})
clockwises.add(wiseSecond)

const date = new Text({
  x: CENTER_X + 150 * 0.5 - (10 * 5) / 2,
  y: CENTER_Y - 10,
  fontSize: 12,
  fontFamily: "Orbitron",
  text: "",
  fill: "#61afff",
  align: "center"
})
clockwises.add(date)

clockwises.add(
  new Circle({
    x: CENTER_X,
    y: CENTER_Y,
    radius: 5,
    fill: "#61afff"
  })
)

function getOffsetWise(
  value: number,
  stop: number,
  ranger: number,
  adjectX: number,
  adjectY: number
): [number, number] {
  const angle = map(value, 0, stop, 0, Math.PI * 2)

  return [
    adjectX + ranger * Math.sin(angle),
    adjectY - ranger * Math.cos(angle)
  ]
}
function fixedTwoLength(num: number): string {
  if (num < 10) return `0${num}`

  return `${num}`
}

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
setInterval(() => {
  const now = new Date()

  const [hours, minutes, seconds] = [
    now.getHours() + now.getMinutes() / 60,
    now.getMinutes() + now.getSeconds() / 60,
    now.getSeconds()
  ]

  ;[wiseHour.attrs.points[2], wiseHour.attrs.points[3]] = getOffsetWise(
    hours,
    12,
    150 * 0.6,
    CENTER_X,
    CENTER_Y
  )
  ;[wiseMinus.attrs.points[2], wiseMinus.attrs.points[3]] = getOffsetWise(
    minutes,
    60,
    150 * 0.8,
    CENTER_X,
    CENTER_Y
  )
  ;[wiseSecond.attrs.points[2], wiseSecond.attrs.points[3]] = getOffsetWise(
    seconds,
    60,
    150 * 0.9,
    CENTER_X,
    CENTER_Y
  )

  // eslint-disable-next-line functional/immutable-data
  date.attrs.text = `${DAYS[now.getDay()]}
${fixedTwoLength(now.getDate())} / ${fixedTwoLength(now.getMonth() + 1)}`
  const clientRect = date.getClientRect()
  // eslint-disable-next-line functional/immutable-data
  date.attrs.x = CENTER_X + 150 / 2 - clientRect.width / 2
  // eslint-disable-next-line functional/immutable-data
  date.attrs.y = CENTER_Y - clientRect.height / 2
}, 1000)
