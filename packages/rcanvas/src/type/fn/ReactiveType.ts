import type { ComputedRef, Ref } from "vue"

export type ReactiveType<T extends object> = {
  [name in keyof T]: T[name] extends object
    ? ReactiveType<T[name]>
    : T[name] | Ref<T[name]> | ComputedRef<T[name]>
}
