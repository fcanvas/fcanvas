/**
 * Code from: https://raw.githubusercontent.com/vueuse/vueuse/main/packages/shared/useIntervalFn
 */

import { effectScope, ref } from "@vue/reactivity"

import { sleep } from "../fns/sleep"

import type { Pausable } from "./useIntervalFn"
import { useIntervalFn } from "./useIntervalFn"

describe("useIntervalFn", () => {
  // eslint-disable-next-line functional/no-let
  let callback = vi.fn()

  beforeEach(() => {
    callback = vi.fn()
  })

  async function exec({ isActive, pause, resume }: Pausable) {
    expect(isActive.value).toBeTruthy()
    expect(callback).toHaveBeenCalledTimes(0)

    await sleep(60)
    expect(callback).toHaveBeenCalledTimes(1)

    pause()
    expect(isActive.value).toBeFalsy()

    await sleep(60)
    expect(callback).toHaveBeenCalledTimes(1)

    resume()
    expect(isActive.value).toBeTruthy()

    await sleep(60)
    expect(callback).toHaveBeenCalledTimes(2)
  }

  async function execImmediateCallback({ isActive, pause, resume }: Pausable) {
    expect(isActive.value).toBeTruthy()
    expect(callback).toHaveBeenCalledTimes(1)

    await sleep(60)
    expect(callback).toHaveBeenCalledTimes(2)

    pause()
    expect(isActive.value).toBeFalsy()

    await sleep(60)
    expect(callback).toHaveBeenCalledTimes(2)

    resume()
    expect(isActive.value).toBeTruthy()
    expect(callback).toHaveBeenCalledTimes(3)

    await sleep(60)
    expect(callback).toHaveBeenCalledTimes(4)
  }

  it("basic pause/resume", async () => {
    await exec(useIntervalFn(callback, 50))

    callback = vi.fn()

    const interval = ref(50)
    await exec(useIntervalFn(callback, interval))

    callback.mockClear()
    interval.value = 20
    await sleep(30)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it("pause/resume with immediateCallback", async () => {
    await execImmediateCallback(
      useIntervalFn(callback, 50, { immediateCallback: true })
    )

    callback = vi.fn()

    const interval = ref(50)
    await execImmediateCallback(
      useIntervalFn(callback, interval, { immediateCallback: true })
    )

    callback.mockClear()
    interval.value = 20

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it("pause/resume in scope", async () => {
    const scope = effectScope()
    await scope.run(async () => {
      await exec(useIntervalFn(callback, 50))
    })

    callback.mockClear()
    await scope.stop()
    await sleep(60)
    expect(callback).toHaveBeenCalledTimes(0)
  })

  it("cant work when interval is negative", async () => {
    const { isActive } = useIntervalFn(callback, -1)

    expect(isActive.value).toBeFalsy()
    await sleep(60)
    expect(callback).toHaveBeenCalledTimes(0)
  })
})
