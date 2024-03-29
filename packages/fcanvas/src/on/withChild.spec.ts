import { shallowRef } from "@vue/reactivity"
import { nextTick } from "src/fns/watch/scheduler"

import { Group } from "../Group"
import { Rect } from "../auto-export"

import { withChild } from "./withChild"

describe("withChildren", () => {
  test("should working with `Group`", async () => {
    const group = new Group({ sync: true, x: 100, y: 100 })
    group.add(new Rect({ x: 0, y: 0, width: 1, height: 1 }))
    group.add(new Rect({ x: 1, y: 1, width: 1, height: 1 }))
    group.add(new Rect({ x: 2, y: 2, width: 1, height: 1 }))

    const result = withChild(group)

    expect(Array.from(result.values())).toEqual([
      { x: 100, y: 100, width: 1, height: 1 },
      { x: 101, y: 101, width: 1, height: 1 },
      { x: 102, y: 102, width: 1, height: 1 }
    ])

    group.add(new Rect({ x: 3, y: 3, width: 1, height: 1 }))

    await nextTick()

    expect(Array.from(result.values())).toEqual([
      { x: 100, y: 100, width: 1, height: 1 },
      { x: 101, y: 101, width: 1, height: 1 },
      { x: 102, y: 102, width: 1, height: 1 },
      { x: 103, y: 103, width: 1, height: 1 }
    ])
  })
  test("should working with `ShallowRef<Group>`", async () => {
    const group = new Group({ sync: true, x: 100, y: 100 })
    group.add(new Rect({ x: 0, y: 0, width: 1, height: 1 }))
    group.add(new Rect({ x: 1, y: 1, width: 1, height: 1 }))
    group.add(new Rect({ x: 2, y: 2, width: 1, height: 1 }))

    const result = withChild(shallowRef(group))

    expect(Array.from(result.values())).toEqual([
      { x: 100, y: 100, width: 1, height: 1 },
      { x: 101, y: 101, width: 1, height: 1 },
      { x: 102, y: 102, width: 1, height: 1 }
    ])

    group.add(new Rect({ x: 3, y: 3, width: 1, height: 1 }))

    await nextTick()

    expect(Array.from(result.values())).toEqual([
      { x: 100, y: 100, width: 1, height: 1 },
      { x: 101, y: 101, width: 1, height: 1 },
      { x: 102, y: 102, width: 1, height: 1 },
      { x: 103, y: 103, width: 1, height: 1 }
    ])
  })
})
