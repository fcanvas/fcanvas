import { getSizeApplyRatio } from "./getSizeApplyRatio"

describe("getSizeApplyRatio", () => {
  test("calc width", () => {
    expect(getSizeApplyRatio(3, true, 3 / 4)).toEqual(4)
    expect(getSizeApplyRatio(4, true, 3 / 4)).toEqual(5.333333333333333)
  })
  test("calc height", () => {
    expect(getSizeApplyRatio(3, false, 3 / 4)).toEqual(2.25)
    expect(getSizeApplyRatio(4, false, 3 / 4)).toEqual(3)
  })
})
