import { expect, it } from "vitest"

import sum from "./sum"

it("sum(1 + 1)", () => {
  expect(sum(1, 1)).toEqual(2)
})
