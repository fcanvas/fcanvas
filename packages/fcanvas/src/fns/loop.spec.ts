import { loop } from "./loop"

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
describe("loop", () => {
  test("should loop", async () => {
    // eslint-disable-next-line functional/no-let
    let i = 0
    const fn = vi.fn((stop: () => void) => {
      i++
      if (i === 10) stop()
    })
    loop(fn)

    await sleep(1_000)

    expect(fn.mock.calls.length).toEqual(10)
  })
  test("should stop loop", async () => {
    // eslint-disable-next-line functional/no-let
    let i = 0
    const fn = vi.fn((stop: () => void) => {
      i++
      if (i === 10) stop()
    })
    const stop = loop(fn)

    await sleep(1_000)

    expect(fn.mock.calls.length).toEqual(10)
    expect(stop.stopped).toEqual(true)
  })
  test("should stop loop with watcher", async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const fn = vi.fn(() => {})
    const stop = loop(fn)

    await sleep(1_000)
    stop()

    expect(fn.mock.calls.length > 2).toEqual(true)
    expect(stop.stopped).toEqual(true)
  })
})
