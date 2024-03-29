/* eslint-disable functional/no-let */
import { isReactive, reactive, ref, toRefs } from "@vue/reactivity"
import { watchSyncEffect } from "src/fns/watch"

import { toReactive } from "./toReactive"
import { nextTick } from "./watch/scheduler"

// https://github.com/vueuse/vueuse/blob/main/packages/shared/toReactive/index.test.ts
describe("toRefs", () => {
  test("should be defined", () => {
    expect(toReactive).toBeDefined()
  })

  test("should work", () => {
    const r = ref({ a: "a", b: 0 })
    const state = toReactive(r)
    expect(state.a).toBe("a")
    expect(state.b).toBe(0)

    r.value.a = "b"
    r.value.b = 1
    expect(state.a).toBe("b")
    expect(state.b).toBe(1)
  })

  test("should be enumerable", () => {
    const obj = { a: "a", b: 0 }
    const r = ref(obj)
    const state = toReactive(r)

    expect(JSON.stringify(state)).toBe(JSON.stringify(r.value))
    expect(state).toEqual(obj)
  })

  test("should be reactive", async () => {
    const r = ref({ a: "a", b: 0 })
    const state = toReactive(r)
    let dummy = 0

    expect(state.a).toBe("a")
    expect(state.b).toBe(0)
    expect(isReactive(state)).toBe(true)

    watchSyncEffect(() => {
      dummy = state.b
    })

    expect(dummy).toBe(0)

    r.value.b += 1

    await nextTick()

    expect(dummy).toBe(1)

    state.b += 1

    await nextTick()

    expect(dummy).toBe(2)
    expect(r.value.b).toBe(2)
  })

  test("should be replaceable", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = ref<any>({ a: "a", b: 0 })
    const state = toReactive(r)
    let dummy = 0

    expect(state.a).toBe("a")
    expect(state.b).toBe(0)

    watchSyncEffect(() => {
      dummy = state.b
    })

    expect(dummy).toBe(0)

    r.value = { b: 1, a: "a" }

    expect(dummy).toBe(1)

    state.b += 1

    expect(dummy).toBe(2)

    r.value = { a: "c" }

    expect(dummy).toBe(undefined)
    expect(state).toEqual({ a: "c" })
  })

  test("toReactive(toRefs())", () => {
    const a = reactive({ a: "a", b: 0 })
    const b = toRefs(a)
    const c = toReactive(b)

    expect(a).toEqual(c)

    a.b = 1

    expect(c.b).toEqual(1)
  })
})
