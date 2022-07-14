// @vitest-environment happy-dom

import { describe, expect, test } from "vitest"

import { getJSON, loadJSON } from "./loadJSON"
import { loadAssets } from "./test/utils/loadAssets"

describe("loadJSON", async () => {
  const url = "https://filesamples.com/samples/code/json/sample2.json"
  const { text, sample } = await loadAssets(url, loadJSON, JSON.parse)

  test("fetch normal loadJSON()", () => {
    expect(text).toEqual(sample)
    expect(typeof text).toEqual("object")
  })
  test("ready getJSON()", () => {
    expect(loadJSON(url, true)).toEqual(sample)
    expect(getJSON(url)).toEqual(sample)
  })
  test("throw if not load", () => {
    expect(() => getJSON("")).throw(
      `Cannot find image ${""}. First run await loadJSON().`
    )
  })
})
