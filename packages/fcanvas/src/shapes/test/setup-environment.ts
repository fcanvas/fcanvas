import { DOMMatrix, Image, loadImage } from "canvas"

import { CONFIGS } from "../../configs"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(self as any).DOMMatrix = DOMMatrix;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Image.prototype as any)[Symbol.toStringTag] = "Image"

CONFIGS.loadImage = loadImage
