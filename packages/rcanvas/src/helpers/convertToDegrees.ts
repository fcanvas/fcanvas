import { radialToDegrees } from "../utils/radialToDegrees"

const globalConfigs = {
  angleMode: "degrees"
}
export function convertToDegrees(val: number): number {
  return globalConfigs.angleMode === "degrees" ? val : radialToDegrees(val)
}
