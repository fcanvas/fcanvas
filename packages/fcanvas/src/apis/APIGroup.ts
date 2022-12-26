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

  public add(node: ChildNode) {
    this[CHILD_NODE].add(node)
  }

  public delete(node: ChildNode) {
    this[CHILD_NODE].delete(node)
  }
}

export abstract class APIGroup<
  ChildNode extends FakeShape,
  Events extends Record<string, unknown>
> extends APIChildNode<ChildNode, Events> {
  public getClientRect(config?: GetClientRectOptions) {
    return getClientRectGroup(this[CHILD_NODE], config)
  }

  public childEach(
    fn: (
      child: ChildNode,
      childKey: ChildNode,
      set: ShallowReactive<Set<ChildNode>>,
      add: (node: ChildNode) => void
    ) => void
  ) {
    if (fn.length >= 4) {
      // add exists
      const valesAdd = new Set<ChildNode>()
      const fnAdd = (val: ChildNode) => valesAdd.add(val)

      this[CHILD_NODE].forEach((child) => {
        fn(child, child, this[CHILD_NODE], fnAdd)
      })

      valesAdd.forEach((item) => this.add(item))
    } else {
      this[CHILD_NODE].forEach(
        fn as (
          child: ChildNode,
          childKey: ChildNode,
          set: ShallowReactive<Set<ChildNode>>
        ) => void
      )
    }
  }
}
