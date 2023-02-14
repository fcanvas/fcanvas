import { sleep } from "./sleep"

describe("sleep", () => {
  test("should work", async () => {
    await sleep(1.2)
    expect(true).toBe(true)
  })
})
