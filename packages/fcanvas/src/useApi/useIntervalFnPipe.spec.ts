import { sleep } from "../fns/sleep"

import { useIntervalFnPipe } from "./useIntervalFnPipe"

describe("useIntervalFnPipe", () => {
  test("should work if (cb)", async () => {
    const fn = vi.fn()

    useIntervalFnPipe(fn)

    await sleep(1000 * 1.2)

    expect(fn.mock.calls.length).toBe(1)
  })
  test("should work (cb, interval)", async () => {
    const fn = vi.fn()

    useIntervalFnPipe(fn, 2000)

    await sleep(1000 * 1.2)

    expect(fn.mock.calls.length).toBe(0)

    await sleep(1000 * 1.2)

    expect(fn.mock.calls.length).toBe(1)
  })
  test("should work (cb, interval, options)", async () => {
    const fn = vi.fn()

    useIntervalFnPipe(fn, 1000, {
      immediateCallback: true
    })

    expect(fn.mock.calls.length).toBe(1)
    await sleep(1000 * 1.2)
    expect(fn.mock.calls.length).toBe(2)
  })
  test("should work on pipe and (cb)", async () => {
    const fn = vi.fn()
    const fn2 = vi.fn()

    useIntervalFnPipe(fn).pipe(fn2)

    await sleep(1000 * 1.2)

    expect(fn.mock.calls.length).toBe(1)
    expect(fn2.mock.calls.length).toBe(1)
  })
  test("should work on only pipe", async () => {
    const fn = vi.fn()

    useIntervalFnPipe().pipe(fn)

    expect(fn.mock.calls.length).toBe(0)

    await sleep(1000 * 1.2)

    expect(fn.mock.calls.length).toBe(1)
  })
})
