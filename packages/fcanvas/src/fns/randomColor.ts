export function randomColor(): string {
  // eslint-disable-next-line functional/no-let
  let randColor = ((Math.random() * 0xffffff) << 0).toString(16)

  randColor = "0".repeat(6 - randColor.length) + randColor

  return `#${randColor}`
}
