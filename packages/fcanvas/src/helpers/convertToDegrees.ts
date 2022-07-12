import { globalConfigs } from "../globalConfigs"
import { radialToDegrees } from "../utils/radialToDegrees"

export function convertToDegrees(val: number): number {
  return globalConfigs.angleMode === "degrees" ? val : radialToDegrees(val)
}
