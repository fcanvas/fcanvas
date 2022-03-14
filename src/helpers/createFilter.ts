import { Offset } from "../types/Offset";

import { convertToDegress } from "./convertToDegress";

export type OptionFilter =
  | "none"
  | {
      // eslint-disable-next-line functional/prefer-readonly-type
      url?: string; // string
      // eslint-disable-next-line functional/prefer-readonly-type
      blur?: number; // px
      // eslint-disable-next-line functional/prefer-readonly-type
      brightness?: number; // int%
      // eslint-disable-next-line functional/prefer-readonly-type
      contrast?: number; // 0 -> 100%
      // eslint-disable-next-line functional/prefer-readonly-type
      dropShadow?: Partial<Offset> & {
        // eslint-disable-next-line functional/prefer-readonly-type
        blur?: number; // intpx > 0
        // eslint-disable-next-line functional/prefer-readonly-type
        color: string;
      };
      // eslint-disable-next-line functional/prefer-readonly-type
      greyscale?: number; // int%
      // eslint-disable-next-line functional/prefer-readonly-type
      hueRotate?: number; // 0 -> 360 deg
      // eslint-disable-next-line functional/prefer-readonly-type
      invert?: number; // int%
      // eslint-disable-next-line functional/prefer-readonly-type
      opacity?: number; // 0 -> 100%
      // eslint-disable-next-line functional/prefer-readonly-type
      saturate?: number; // int%
      // eslint-disable-next-line functional/prefer-readonly-type
      sepia?: number; // int%
    };
export function createFilter(options: OptionFilter): string {
  if (options === "none") {
    return "none";
  }
  // eslint-disable-next-line functional/no-let
  let filter = "";
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (options!.url !== void 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    filter += `url(${JSON.stringify(options!.url)})`;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (options!.blur !== void 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    filter += `blur(${options!.blur}px)`;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (options!.brightness !== void 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    filter += `brightness(${options!.brightness}%)`;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (options!.contrast !== void 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    filter += `contrast(${options!.contrast})`;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (options!.dropShadow !== void 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    filter += `drop-shadow(${options!.dropShadow.x ?? 0}px ${
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      options!.dropShadow.y ?? 0
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    }px ${options!.dropShadow.blur ?? 0}px ${options!.dropShadow.color})`;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (options!.greyscale !== void 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    filter += `greyscale(${options!.greyscale}%)`;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (options!.hueRotate !== void 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    filter += `hue-rotate(${convertToDegress(options!.hueRotate)}deg)`;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (options!.invert !== void 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    filter += `invert(${options!.invert}%)`;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (options!.opacity !== void 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    filter += `opacity(${options!.opacity}%)`;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (options!.saturate !== void 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    filter += `saturate(${options!.saturate}%)`;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (options!.sepia !== void 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    filter += `sepia(${options!.sepia}%)`;
  }
  if (filter === "") {
    filter = "none";
  }

  return filter;
}
