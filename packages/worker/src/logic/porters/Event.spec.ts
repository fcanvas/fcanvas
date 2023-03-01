import { createFakeEvent, resolveFakeEvent } from "./Event"

describe("transport-event", () => {
  test("createFakeEvent", () => {
    const event = new TouchEvent("touchmove", {
      touches: [
        {
          identifier: 0,
          target: document.body,

          clientX: 0,
          clientY: 0,
          force: 0,
          pageX: 0,
          pageY: 0,
          radiusX: 0,
          radiusY: 0,
          rotationAngle: 0,
          screenX: 0,
          screenY: 0
        }
      ]
    })
    event.touches.toString = () => "[object TouchList]"
    const channel = new MessageChannel()
    const result = createFakeEvent(channel.port2, event)

    expect(result.isTrusted).toBeTypeOf("boolean")
    expect(result.type).toBe("touchmove")
    expect(result.target).toBe(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((result.preventDefault as unknown as any).__v_noop).toBe(true)
    expect(result.touches.__v_type).toBe("TouchList")
    expect(result.touches.value).toEqual([
      {
        identifier: 0,
        target: null,
        clientX: 0,
        clientY: 0,
        force: 0,
        pageX: 0,
        pageY: 0,
        radiusX: 0,
        radiusY: 0,
        rotationAngle: 0,
        screenX: 0,
        screenY: 0
      }
    ])
  })
  test("resolveFakeEvent", () => {
    const event = new TouchEvent("touchmove", {
      touches: [
        {
          identifier: 0,
          target: document.body,

          clientX: 0,
          clientY: 0,
          force: 0,
          pageX: 0,
          pageY: 0,
          radiusX: 0,
          radiusY: 0,
          rotationAngle: 0,
          screenX: 0,
          screenY: 0
        }
      ]
    })
    event.touches.toString = () => "[object TouchList]"
    const channel = new MessageChannel()

    const result = resolveFakeEvent<TouchEvent>(
      channel.port1,
      createFakeEvent(channel.port2, event)
    )

    expect(result.isTrusted).toBeTypeOf("boolean")
    expect(result.type).toBe("touchmove")
    expect(result.target).toBe(null)
    expect(result.preventDefault).toBeTypeOf("function")
    expect(result.touches).toBeTypeOf("object")
    expect(result.touches + "").toBe("[object TouchList]")
    expect(result.touches[0]).toBe(result.touches.item(0))
    expect(result.touches[0]).toEqual({
      identifier: 0,
      target: null,
      clientX: 0,
      clientY: 0,
      force: 0,
      pageX: 0,
      pageY: 0,
      radiusX: 0,
      radiusY: 0,
      rotationAngle: 0,
      screenX: 0,
      screenY: 0
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect([...result.touches as unknown as any]).toEqual([
      {
        identifier: 0,
        target: null,
        clientX: 0,
        clientY: 0,
        force: 0,
        pageX: 0,
        pageY: 0,
        radiusX: 0,
        radiusY: 0,
        rotationAngle: 0,
        screenX: 0,
        screenY: 0
      }
    ])
  })
})
