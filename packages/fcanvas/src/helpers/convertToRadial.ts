import { globalConfigs } from "../globalConfigs"
import { degreesToRadial } from "../utils/degreesToRadial"

export function convertToRadial(val: number): number {
  return globalConfigs.angleMode === "radial" ? val : degreesToRadial(val)
}
