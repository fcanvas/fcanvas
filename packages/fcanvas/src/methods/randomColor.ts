export function randomColor(): string {
  // eslint-disable-next-line functional/no-let
  let randColor = ((Math.random() * 0xffffff) << 0).toString(16)

  while (randColor.length < 6) randColor = "0" + randColor

  return `#${randColor}`
}
