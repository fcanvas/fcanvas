import { ref } from "@vue/reactivity"

import { Group } from "../Group"
import { Shape } from "../Shape"
import { BOUNDING_CLIENT_RECT } from "../symbols"

import { isBoxClientRect } from "./isBoxClientRect"

describe("isBoxClientRect", () => {
  test("should is box", () => {
    expect(
      isBoxClientRect({
        [BOUNDING_CLIENT_RECT]: ref({})
      })
    ).toEqual(true)
  })
  test("should is Group", () => {
    expect(isBoxClientRect(new Group())).toEqual(true)
  })
  test("should is Shape", () => {
    expect(isBoxClientRect(new Shape({ x: 0, y: 0 }))).toEqual(true)
  })
  test("should is nil", () => {
    expect(isBoxClientRect(undefined)).toEqual(false)
    expect(isBoxClientRect(null)).toEqual(false)
  })
  test("should is not box", () => {
    expect(isBoxClientRect({})).toEqual(false)
  })
})
