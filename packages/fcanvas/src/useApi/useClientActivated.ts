import type { getMousePos } from "../methods/getMousePos"

// eslint-disable-next-line functional/no-let
let clientActivated: ReturnType<typeof getMousePos>[0] | null

export function _setClientActivated(
  client: ReturnType<typeof getMousePos>[0] | null
) {
  clientActivated = client
}

export function useClientActivated(): ReturnType<typeof getMousePos>[0] {
  if (!clientActivated) {
    console.warn(
      "[useClientActivated]: call this function on stack event handler."
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return clientActivated!
}
