// @vitest-environment happy-dom

import { describe, expect, test } from "vitest"

import { getFetch, loadFetch } from "./loadFetch"
import { loadAssets } from "./test/utils/loadAssets"

describe("loadFetch", async () => {
  const url = "https://filesamples.com/samples/document/txt/sample1.txt"
  const { text, sample } = await loadAssets(url, loadFetch)

  test("fetch normal loadFetch()", () => {
    expect(text).toEqual(sample)
  })
  test("ready getFetch()", () => {
    expect(loadFetch(url, true)).toEqual(sample)
    expect(getFetch(url)).toEqual(sample)
  })
  test("throw if not load", () => {
    expect(() => getFetch("")).throw(
      `Cannot find image ${""}. First run await loadFetch().`
    )
  })
})
