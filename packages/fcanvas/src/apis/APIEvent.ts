import type { ShallowReactive } from "@vue/reactivity"
import { shallowReactive } from "@vue/reactivity"

import { LISTENERS, LISTENERS_ROOT } from "../symbols"

export class APIEvent<Events extends Record<string, unknown>> {
  public readonly [LISTENERS]: ShallowReactive<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Map<keyof Events, Set<(event: any) => void>>
  > = shallowReactive(new Map())

  public readonly [LISTENERS_ROOT]: ShallowReactive<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Map<keyof Events, Set<(event: any) => void>>
  > = shallowReactive(new Map())

  public on<Event extends keyof Events>(
    event: Event,
    listener: (event: Events[Event]) => void,
    root = false
  ): void {
    const key = root ? LISTENERS_ROOT : LISTENERS
    if (!this[key].has(event)) this[key].set(event, new Set())

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this[key].get(event)!.add(listener)
  }

  public off<Event extends keyof Events>(
    event: Event,
    listener?: (event: Events[Event]) => void,
    root = false
  ): void {
    if (listener)
      this[root ? LISTENERS_ROOT : LISTENERS].get(event)?.delete(listener)
    else this[root ? LISTENERS_ROOT : LISTENERS].delete(event)
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
