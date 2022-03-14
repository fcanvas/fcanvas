import { globalConfigs } from "../global-configs";
import { degressToRadial } from "../utils/degressToRadial";

export function convertToRadial(val: number): number {
  return globalConfigs.angleMode === "radial" ? val : degressToRadial(val);
}
