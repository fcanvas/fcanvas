import { degreesToRadial } from "../utils/degreesToRadial"

const globalConfigs = {
  angleMode: "degrees"
}

export function convertToRadial(val: number): number {
  return globalConfigs.angleMode === "radial" ? val : degreesToRadial(val)
}
