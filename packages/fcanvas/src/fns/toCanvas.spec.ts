import { Group, Layer, Rect, Stage } from ".."

import { toCanvas } from "./toCanvas"

describe("toCanvas", () => {
  // Layer | Shape | Group | Stage
  test("should work on Layer", () => {
    const layer = new Layer({
      width: 300,
      height: 150
    })
    layer.add(
      new Rect({
        x: 0,
        y: 0,
        width: 40,
        height: 40,
        fill: "red"
      })
    )
    layer.draw()
    expect(toCanvas(layer).toDataURL()).toBe(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAABmJLR0QA/wD/AP+gvaeTAAABKElEQVR4nO3UwQ3AIBDAsKP77wwr9AeR7Anyytozex62ZtbtBuAN3+0AgL8MC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIOoAFbkCUO1TZ8UAAAAASUVORK5CYII="
    )
  })

  test("should work on Shape", () => {
    const shape = new Rect({
      x: 0,
      y: 0,
      width: 40,
      height: 40,
      fill: "red"
    })

    expect(toCanvas(shape).toDataURL()).toBe(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAARUlEQVRYhe3OMQGAMBAAsQf/nh8JDDe0Q6Igz87sXOw9HfgjWAlWgpVgJVgJVoKVYCVYCVaClWAlWAlWgpVgJVgJVoLVByNHAk6vxFc8AAAAAElFTkSuQmCC"
    )
  })

  test("should work on Group", () => {
    const group = new Group({ sync: true })
    group.add(
      new Rect({
        x: 0,
        y: 0,
        width: 40,
        height: 40,
        fill: "red"
      })
    )

    expect(toCanvas(group).toDataURL()).toBe(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAARUlEQVRYhe3OMQGAMBAAsQf/nh8JDDe0Q6Igz87sXOw9HfgjWAlWgpVgJVgJVoKVYCVYCVaClWAlWAlWgpVgJVgJVoLVByNHAk6vxFc8AAAAAElFTkSuQmCC"
    )
  })

  test("should work on Stage", () => {
    const stage = new Stage()
    const layer = new Layer({
      width: 300,
      height: 150
    })
    stage.add(layer)
    layer.add(
      new Rect({
        x: 0,
        y: 0,
        width: 40,
        height: 40,
        fill: "red"
      })
    )

    expect(toCanvas(stage).toDataURL()).toBe(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAABmJLR0QA/wD/AP+gvaeTAAABKElEQVR4nO3UwQ3AIBDAsKP77wwr9AeR7Anyytozex62ZtbtBuAN3+0AgL8MC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLCDDsIAMwwIyDAvIMCwgw7CADMMCMgwLyDAsIMOwgAzDAjIMC8gwLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIOoAFbkCUO1TZ8UAAAAASUVORK5CYII="
    )
  })
})
