import { describe, expect, test } from "vitest"

import { matchesSelector } from "./matchesSelector"

const el: readonly [string, string, string] = [
  /* type: */ "Arc",
  /* name: */ "hero main",
  /* id: */ "main"
]

describe.each([
  { selector: "Arc", result: true },
  { selector: "hero", result: false },
  { selector: ".hero", result: true },
  { selector: ".hero.main", result: true },
  { selector: ".hero.maid", result: false },
  { selector: "Arc.hero", result: true },
  { selector: "Arc.hero.main", result: true },
  { selector: "#main", result: true },
  { selector: "Arc#main", result: true },
  { selector: ".hero#main", result: true },
  { selector: "Arc.hero#main", result: true }
])(".matches('$selector')", ({ selector, result }) => {
  test(`is ${result}`, () => {
    expect(matchesSelector(selector, ...el)).toBe(result)
  })
})
