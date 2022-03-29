import { VirualChildNode } from "../Container";
import { Utils } from "../Utils";
import { Offset } from "../types/Offset";

import { createFilter, OptionFilter } from "./createFilter";
import { createTransform, OptionTransform } from "./createTransform";

export type AttrsDrawLayerContext = {
  // eslint-disable-next-line functional/prefer-readonly-type
  opacity?: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  clip?:
    | (Offset & {
        // eslint-disable-next-line functional/prefer-readonly-type
        width: number;
        // eslint-disable-next-line functional/prefer-readonly-type
        height: number;
      })
    | ((context: Path2D) => void);
} & OptionTransform & {
    // eslint-disable-next-line functional/prefer-readonly-type
    filter?: OptionFilter;
  };

export function drawLayerContextUseOpacityClipTransformFilter(
  context: CanvasRenderingContext2D,
  attrs: AttrsDrawLayerContext,
  // eslint-disable-next-line functional/prefer-readonly-type
  children: Set<
    VirualChildNode & {
      // eslint-disable-next-line functional/no-method-signature
      draw(context: CanvasRenderingContext2D): void;
    }
  >,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  argThis: any = void 0
) {
  const needBackup = attrs.clip !== void 0;

  if (needBackup) {
    context.save();

    if (typeof attrs.clip === "function") {
      const path = new Utils.Path2D();
      attrs.clip.call(argThis, path);
      context.clip(path);
    } else {
      context.rect(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        attrs.clip!.x,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        attrs.clip!.y,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        attrs.clip!.width,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        attrs.clip!.height
      );
    }
  }
  const needUseTransform =
    attrs.scale !== void 0 ||
    attrs.rotation !== void 0 ||
    attrs.offset !== void 0 ||
    attrs.skewX !== void 0 ||
    attrs.skewY !== void 0 ||
    !context;
  const needSetAlpha = attrs.opacity !== void 0;
  const useFilter = attrs.filter !== void 0;
  // eslint-disable-next-line functional/no-let
  let backupTransform, backupAlpha: number, backupFilter: string;

  if (needSetAlpha) {
    backupAlpha = context.globalAlpha;
    // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
    context.globalAlpha = attrs.opacity!;
  }
  if (needUseTransform) {
    backupTransform = context.getTransform();

    context.setTransform(createTransform(attrs, !context));
  }
  if (useFilter) {
    backupFilter = context.filter;

    // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
    context.filter = createFilter(attrs.filter!);
  }

  children.forEach((node) => {
    node.draw(context);
  });

  if (useFilter) {
    // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
    context.filter = backupFilter!;
  }
  if (needUseTransform) {
    context.setTransform(backupTransform);
  }
  if (needSetAlpha) {
    // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
    context.globalAlpha = backupAlpha!;
  }
  if (needBackup) {
    context.restore();
  }
}
