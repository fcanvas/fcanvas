import type { Ref, UnwrapRef } from "@vue/reactivity"

export type ReactiveType<T> = T extends object
  ? {
      [K in keyof T]: UnwrapRef<T[K]> | Ref<UnwrapRef<T[K]>>
    }
  : T
