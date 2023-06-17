import type { ShallowReactive } from "@vue/reactivity"
import { shallowReactive } from "@vue/reactivity"

import { CHILD_NODE } from "../symbols"
import type { GetClientRectOptions } from "../type/GetClientRectOptions"
import type { FakeShape } from "../utils/getClientRectOfGroup"
import { getClientRectGroup } from "../utils/getClientRectOfGroup"

import { APIEvent } from "./APIEvent"

// function partition(children: FakeShape[], left: number, right: number) {
//   const pivotIndex = right
//   const pivotValue = children[pivotIndex].$.zIndex ?? 0.5
//   right--
//   while (true) {
//     while (left <= right && (children[left].$.zIndex ?? 0.5) < pivotValue)
//       left++

//     while (left <= right && (children[right].$.zIndex ?? 0.5) > pivotValue)
//       right--

//     if (left >= right) break
//     ;[children[left], children[right]] = [children[right], children[left]]
//     left++
//     right--
//   }
//   ;[children[left], children[pivotIndex]] = [
//     children[pivotIndex],
//     children[left]
//   ]
//   return left
// }
// function quickSortShapes(
//   children: FakeShape[],
//   left = 0,
//   right: number = children.length - 1
// ) {
//   if (left >= right) return
//   const pivotIndex = partition(children, left, right)
//   quickSortShapes(children, left, pivotIndex - 1)
//   quickSortShapes(children, pivotIndex + 1, right)
// }

export abstract class APIChildNode<
  ChildNode extends FakeShape,
  Events extends Record<string, unknown>
> extends APIEvent<Events> {
  public readonly [CHILD_NODE]: ShallowReactive<Set<ChildNode>> =
    shallowReactive(new Set())

  public get children() {
    return this[CHILD_NODE]
  }

  // public readonly [CHILD_SORTED]: ComputedRef<ChildNode[]>

  // constructor() {
  //   super()
  //   this[CHILD_SORTED] = computed(() => {
  //     const arr = Array.from(this.children.values())

  //     quickSortShapes(arr)

  //     return arr
  //   })
  // }

  public add(node: ChildNode) {
    return this[CHILD_NODE].add(node)
  }

  public delete(node: ChildNode) {
    return this[CHILD_NODE].delete(node)
  }

  public destroy() {
    super.destroy()
    this[CHILD_NODE].clear()
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
