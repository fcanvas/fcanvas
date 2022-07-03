import type { ShallowReactive } from "@vue/reactivity"
import { shallowReactive } from "@vue/reactivity"

import { LISTENERS } from "../symbols"

export class APIEvent<Events extends Record<string, unknown>> {
  public readonly [LISTENERS]: ShallowReactive<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Map<keyof Events, Set<(event: any) => void>>
  > = shallowReactive(new Map())

  public on<Event extends keyof Events>(
    event: Event,
    listener: (event: Events[Event]) => void
  ): void {
    if (!this[LISTENERS].has(event)) this[LISTENERS].set(event, new Set())

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this[LISTENERS].get(event)!.add(listener)
  }

  public off<Event extends keyof Events>(
    event: Event,
    listener?: (event: Events[Event]) => void
  ): void {
    if (listener) this[LISTENERS].get(event)?.delete(listener)
    else this[LISTENERS].delete(event)
  }

  public emit<Event extends keyof Events>(
    event: Event,
    data: Events[Event]
  ): void
  public emit<Key extends keyof Events>(
    type: undefined extends Events[Key] ? Key : never
  ): void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public emit(event: string, data?: any): void {
    this[LISTENERS].get(event)?.forEach((cb) => cb(data))
  }
}
