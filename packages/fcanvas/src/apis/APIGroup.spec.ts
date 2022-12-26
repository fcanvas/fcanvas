/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { CHILD_NODE } from "./../symbols"
import { APIGroup } from "./APIGroup"

describe("APIGroup", () => {
  test("add()", () => {
    const group = new (class extends APIGroup<any, {}> {})()

    expect(Array.from(group[CHILD_NODE].values())).toEqual([])
    group.add(1)
    expect(Array.from(group[CHILD_NODE].values())).toEqual([1])
  })
  test("delete()", () => {
    const group = new (class extends APIGroup<any, {}> {})()

    group.add(1)
    expect(Array.from(group[CHILD_NODE].values())).toEqual([1])
    group.delete(1)
    expect(Array.from(group[CHILD_NODE].values())).toEqual([])
  })
  describe("childEach()", () => {
    test("should normal", () => {
      const group = new (class extends APIGroup<any, {}> {})()

      group.add(1)
      group.add(2)
      group.add(3)

      const fn = vi.fn((i: number) => i)
      group.childEach((item) => {
        fn(item)
      })

      expect(fn.mock.calls).toEqual([[1], [2], [3]])
    })
    test("should delete item in each", () => {
      const group = new (class extends APIGroup<any, {}> {})()

      group.add(1)
      group.add(2)
      group.add(3)

      const fn = vi.fn((i: number) => i)
      group.childEach((item, item2, set) => {
        fn(item)
        set.delete(item + 1)
      })

      expect(fn.mock.calls).toEqual([[1], [3]])
    })
    test("should add item in each use `this.add`", () => {
      const group = new (class extends APIGroup<any, {}> {})()

      group.add(1)
      group.add(2)
      group.add(3)

      const fn = vi.fn((i: number) => i)
      group.childEach((item, item2, set) => {
        fn(item)
        if (item === 2) set.add(item * 2)
      })

      expect(fn.mock.calls).toEqual([[1], [2], [3], [4]])
    })
    test("should add item in each use `add`", () => {
      const group = new (class extends APIGroup<any, {}> {})()

      group.add(1)
      group.add(2)
      group.add(3)

      const fn = vi.fn((i: number) => i)
      group.childEach((item, item2, set, add) => {
        fn(item)
        if (item === 2) add(item * 2)
      })

      expect(fn.mock.calls).toEqual([[1], [2], [3]])
      expect(Array.from(group[CHILD_NODE].values())).toEqual([1, 2, 3, 4])
    })
  })
})
