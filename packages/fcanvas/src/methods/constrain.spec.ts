import { describe, expect, test } from "vitest"

import { constrain } from "./constrain"

describe.each([
  {
    value: 12,
    min: 0,
    max: 100,

    expected: 12
  },
  {
    value: -1212,
    min: 0,
    max: 100,

    expected: 0
  },
  {
    value: 200,
    min: 0,
    max: 100,

    expected: 100
  }
])("constrain($value, $min, $max)", ({ value, min, max, expected }) => {
  test(`constrain(${value}, ${min}, ${max})`, () => {
    expect(constrain(value, min, max)).toBe(expected)
  })
})
