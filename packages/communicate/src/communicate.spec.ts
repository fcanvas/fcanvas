/* eslint-disable @typescript-eslint/no-empty-function */
import { listen, put } from "./communicate"

describe("communicate", () => {
  // eslint-disable-next-line functional/no-let
  let port1: MessagePort, port2: MessagePort

  beforeEach(() => {
    const channel = new MessageChannel()
    port1 = channel.port1
    port2 = channel.port2

    port1.start()
    port2.start()
  })

  describe("listen", () => {
    describe("cb arguments", () => {
      test("should empty", async () => {
        const fn = vi.fn()

        listen(port1, "test", () => {
          fn()
        })

        await put(port2, "test")

        expect(fn.mock.calls.length).toBe(1)
        await put(port2, "test")
        expect(fn.mock.calls.length).toBe(2)
      })
      test("should use", async () => {
        const fn = vi.fn()

        listen<(msg1: string, msg2: string) => void>(
          port1,
        "test",
        (msg1, msg2) => {
          fn([msg1, msg2].join(" "))
        }
        )

        await put(port2, "test", "hello", "world")

        expect(fn.mock.calls.length).toBe(1)
        expect(fn.mock.calls[0][0]).toBe("hello world")
      })
    })
    describe("cb return", () => {
      test("not return", async () => {
        const fn = vi.fn()

        listen(port1, "test", () => {
          fn()
        })

        expect((await put(port2, "test")) === undefined).toBe(true)
      })
      test("return raw value", async () => {
        const fn = vi.fn()

        listen(port1, "test", () => {
          fn()

          return 20
        })

        expect(await put(port2, "test")).toBe(20)
      })
      test("return [value]", async () => {
        const fn = vi.fn()

        listen(port1, "test", () => {
          fn()

          return {
            return: 20
          }
        })

        expect(await put(port2, "test")).toBe(20)
      })
      test("return [value, transfer]", async () => {
        const fn = vi.fn()
        const buffer = new Uint8Array([1, 2, 3]).buffer

        listen(port1, "test", () => {
          fn()

          return {
            return: buffer,
            transfer: [buffer]
          }
        })

        expect(await put(port2, "test")).toEqual(buffer)
      })
    })
    test("should listener return promise", async () => {
      const fn = vi.fn()

      listen(port1, "test", async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        fn()
        return 0
      })

      expect(await put(port2, "test")).toBe(0)
      expect(fn.mock.calls.length).toBe(1)
    })
    test("use option once: true", async () => {
      const fn = vi.fn()

      listen(
        port1,
        "test",
        async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          fn()
          return 0
        },
        {
          once: true
        }
      )

      expect(await put(port2, "test")).toBe(0)
      expect(fn.mock.calls.length).toBe(1)
      await expect(
        put(port2, { name: "test", timeout: 1_000 })
      ).rejects.toThrow("timeout")
      expect(fn.mock.calls.length).toBe(1)
    })
  })
  describe("put", () => {
    test("options: timeout", async () => {
      // listen(port1, "test", () => {})

      expect(put(port2, { name: "test", timeout: 50 })).rejects.toThrow(
        "timeout"
      )
    })
    test("options: transfer", async () => {
      const fn = vi.fn()
      const buffer = new Uint8Array([1, 2, 3]).buffer

      listen(port1, "test", (b) => {
        fn(b)
      })

      await put(port2, { name: "test", transfer: [buffer] }, buffer)

      expect(fn.mock.calls[0][0]).toEqual(buffer)
    })
    test("options: signal", async () => {
      listen(port1, "test", () => {})

      const abort = new AbortController()
      expect(
        put(port2, { name: "test", signal: abort.signal })
      ).rejects.toThrow("aborted")

      abort.abort()
    })
  })
})
