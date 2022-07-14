import { describe, expect, test } from "vitest"

import { normalize } from "./normalize"

describe("normalize", () => {
  test("normalize(n, min, max)", () => {
    expect(normalize(50, 0, 100)).toEqual(50)
    expect(normalize(125, 0, 100)).toEqual(25)
    expect(normalize(-25, 0, 100)).toEqual(75)
  })
})
