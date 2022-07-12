import type { ShallowReactive } from "@vue/reactivity"
import { shallowReactive } from "@vue/reactivity"

import { CHILD_NODE } from "../symbols"
import type { GetClientRectOptions } from "../type/GetClientRectOptions"
import type { FakeShape } from "../utils/getClientRectOfGroup"
import { getClientRectGroup } from "../utils/getClientRectOfGroup"

import { APIEvent } from "./APIEvent"

export abstract class APIChildNode<
  ChildNode extends Omit<FakeShape, "attrs">,
  Events extends Record<string, unknown>
> extends APIEvent<Events> {
  public readonly [CHILD_NODE]: ShallowReactive<Set<ChildNode>> =
    shallowReactive(new Set())

  // eslint-disable-next-line functional/functional-parameters
  public add(...nodes: ChildNode[]) {
    nodes.forEach((node) => this[CHILD_NODE].add(node))
  }

  // eslint-disable-next-line functional/functional-parameters
  public delete(...nodes: ChildNode[]) {
    nodes.forEach((node) => this[CHILD_NODE].delete(node))
  }
}

export abstract class APIGroup<
  ChildNode extends FakeShape,
  Events extends Record<string, unknown>
> extends APIChildNode<ChildNode, Events> {
  public getClientRect(config?: GetClientRectOptions) {
    return getClientRectGroup(this[CHILD_NODE], config)
  }
}
