export function getPropsNameEvent<T extends Event>(
  event: T
): readonly string[] {
  const props: string[] = Object.keys(event)

  // eslint-disable-next-line functional/no-let
  let prototype = event

  while (
    prototype.constructor?.name !== "Event" &&
    (prototype = Object.getPrototypeOf(prototype))
  )
    props.push(...Object.keys(prototype))

  return props
}
