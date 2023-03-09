import type { ShallowReactive } from "@vue/reactivity"
import { shallowReactive } from "@vue/reactivity"

import { LISTENERS } from "../symbols"

type ExtendEvents<T extends Record<string, unknown>> = T & {
  destroy: void
}

type SetUnwantedTypeToNever<T, ValueType> = {
  [Key in keyof T]-?: T[Key] extends ValueType ? Key : never
}

export abstract class APIEvent<Events extends Record<string, unknown>> {
  public readonly [LISTENERS]: ShallowReactive<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Map<keyof Events, Set<(event: any) => void>>
  > = shallowReactive(new Map())

  public on<Event extends keyof ExtendEvents<Events>>(
    event: Event,
    listener: (event: ExtendEvents<Events>[Event]) => void
  ): void {
    if (!this[LISTENERS].has(event)) this[LISTENERS].set(event, new Set())

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this[LISTENERS].get(event)!.add(listener)
  }

  public off<Event extends keyof ExtendEvents<Events>>(
    event: Event,
    listener?: (event: ExtendEvents<Events>[Event]) => void
  ): void {
    if (listener) this[LISTENERS].get(event)?.delete(listener)
    else this[LISTENERS].delete(event)
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
