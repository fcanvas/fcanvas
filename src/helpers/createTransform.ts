import { Offset } from "../types/Offset";

import { convertToDegress } from "./convertToDegress";

export type OptionTransform = Partial<Offset> & {
  // eslint-disable-next-line functional/prefer-readonly-type
  scale?: Partial<Offset>;
  // eslint-disable-next-line functional/prefer-readonly-type
  rotation?: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  offset?: Partial<Offset>;
  // eslint-disable-next-line functional/prefer-readonly-type
  skewX?: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  skewY?: number;
};
export function createTransform(
  options: OptionTransform,
  force = false
): DOMMatrix {
  const transform = new DOMMatrix();

  if (options.scale !== void 0) {
    transform.scale(options.scale.x || 1, options.scale.y || 1);
  }
  if (options.rotation !== void 0) {
    transform.rotate(convertToDegress(options.rotation));
  }
  if (options.offset !== void 0 || force) {
    transform.translate(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      options.offset?.x || 0 + options.x!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      options.offset?.y || 0 + options.y!
    );
  }
  if (options.skewX !== void 0) {
    transform.skewX(options.skewX);
  }
  if (options.skewY !== void 0) {
    transform.skewY(options.skewY);
  }

  return transform;
}
