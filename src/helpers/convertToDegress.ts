import { globalConfigs } from "../global-configs";
import { radialToDegress } from "../utils/radialToDegress";

export function convertToDegress(val: number): number {
  return globalConfigs.angleMode === "degress" ? val : radialToDegress(val);
}
