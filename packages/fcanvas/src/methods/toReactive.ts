/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Ref } from "@vue/reactivity"
import { isRef, reactive, unref } from "@vue/reactivity"

// https://github.com/vueuse/vueuse/blob/main/packages/shared/toReactive/index.ts
export function toReactive<T extends object>(objectRef: T | Ref<T>): T {
  if (!isRef(objectRef)) return reactive(objectRef) as T

  const proxy = new Proxy(
    {},
    {
      get(_, p, receiver) {
        return unref(Reflect.get(objectRef.value, p, receiver))
      },
      set(_, p, value) {
        if (isRef((objectRef.value as any)[p]) && !isRef(value))
          (objectRef.value as any)[p].value = value
        else (objectRef.value as any)[p] = value
        return true
      },
      deleteProperty(_, p) {
        return Reflect.deleteProperty(objectRef.value, p)
      },
      has(_, p) {
        return Reflect.has(objectRef.value, p)
      },
      ownKeys() {
        return Object.keys(objectRef.value)
      },
      getOwnPropertyDescriptor() {
        return {
          enumerable: true,
          configurable: true
        }
      }
    }
  )

  return reactive(proxy) as T
}
