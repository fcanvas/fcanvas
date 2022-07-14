import { describe, expect, test } from "vitest"

import { randomColor } from "./randomColor"

describe("randomColor", () => {
  test("randomColor", () => {
    expect(randomColor()).toMatch(/^#[0-9a-f]{6}$/)
    expect(randomColor()).toMatch(/^#[0-9a-f]{6}$/)
    expect(randomColor()).toMatch(/^#[0-9a-f]{6}$/)
    expect(randomColor()).toMatch(/^#[0-9a-f]{6}$/)
  })
})
