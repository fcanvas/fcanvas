import { describe, expect, test } from "vitest"

import { Shape } from "../Shape"

import { getClientRectGroup } from "./getClientRectGroup"

describe.each([
  {
    items: [
      {
        x: 0,
        y: 0,
        width: 10,
        height: 20
      },
      {
        x: 50,
        y: 100,
        width: 50,
        height: 50
      }
    ],
    result: {
      x: 0,
      y: 0,
      width: 100,
      height: 150
    }
  }
])("getClientRectGroup(<$#>)", ({ items, result }) => {
  test("is ok?", () => {
    expect(getClientRectGroup(items.map((item) => new Shape(item)))).toEqual(
      result
    )
  })
})
