const UIEvent2 =
  typeof UIEvent !== "undefined"
    ? UIEvent
    : (class UIEvent3 {
        isTrusted = false
        bubbles = false
        cancelBubble = false
        cancelable = false
        composed = false
        currentTarget = null
        defaultPrevented = false
        detail = 0
        eventPhase = 0
        returnValue = true
        sourceCapabilities = null
        srcElement = null
        target = null
        timeStamp = Date.now()
        view = null
        which = 0
        // eslint-disable-next-line no-useless-constructor
        constructor(public type: string) {}
      } as unknown as typeof UIEvent)

export { UIEvent2 as UIEvent }
