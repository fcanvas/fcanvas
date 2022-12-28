import type { ShallowReactive } from "@vue/reactivity"
import { shallowReactive } from "@vue/reactivity"

import { LISTENERS, LISTENERS_ROOT, LOCALS } from "../symbols"

type ExtendEvents<T extends Record<string, unknown>> = T & {
  destroy: void
}

type SetUnwantedTypeToNever<T, ValueType> = {
  [Key in keyof T]-?: T[Key] extends ValueType ? Key : never
}

export class APIEvent<Events extends Record<string, unknown>> {
  public [LOCALS]: Record<string, unknown> = {}

  public readonly [LISTENERS]: ShallowReactive<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Map<keyof Events, Set<(event: any) => void>>
  > = shallowReactive(new Map())

  public readonly [LISTENERS_ROOT]: ShallowReactive<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Map<keyof Events, Set<(event: any) => void>>
  > = shallowReactive(new Map())

  public on<Event extends keyof ExtendEvents<Events>>(
    event: Event,
    listener: (event: ExtendEvents<Events>[Event]) => void,
    root = false
  ): void {
    const key = root ? LISTENERS_ROOT : LISTENERS
    if (!this[key].has(event)) this[key].set(event, new Set())

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this[key].get(event)!.add(listener)
  }

  public off<Event extends keyof ExtendEvents<Events>>(
    event: Event,
    listener?: (event: ExtendEvents<Events>[Event]) => void,
    root = false
  ): void {
    if (listener)
      this[root ? LISTENERS_ROOT : LISTENERS].get(event)?.delete(listener)
    else this[root ? LISTENERS_ROOT : LISTENERS].delete(event)
  }

  public emit<Key extends keyof ExtendEvents<Events>>(type: Key): void
  public emit<
    Event extends keyof SetUnwantedTypeToNever<
      ExtendEvents<Events>,
      void | undefined
    >
  >(event: Event, data: ExtendEvents<Events>[Event]): void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public emit(event: string, data?: any): void {
    this[LISTENERS].get(event)?.forEach((cb) => cb(data))
  }

  public destroy() {
    this.emit("destroy")
    this[LISTENERS].clear()
  }
}
