export function getSizeApplyRatio(
  val: number,
  isWidth: boolean,
  ratio: number /* is equal width / height */
) {
  if (isWidth) {
    // find height
    return val / ratio
  }

  // find width
  return val * ratio
}
