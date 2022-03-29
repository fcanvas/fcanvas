import { createCanvas, DOMMatrix, Image }from "canvas"
import { Utils } from "fcanvas"
// import Path2D from "path2d-polyfill"

// eslint-disable-next-line functional/immutable-data
Utils.DOMMatrix = DOMMatrix
// eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-explicit-any
Utils.Path2D = class {} as any
// eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-explicit-any
Utils.Image = Image as any
// eslint-disable-next-line functional/immutable-data
Utils.document = {
    getElementById(): HTMLElement | null {
        return null;
    }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
// eslint-disable-next-line functional/immutable-data
Utils.createCanvas = () => createCanvas(300, 300) as unknown as HTMLCanvasElement
// eslint-disable-next-line @typescript-eslint/no-explicit-any, functional/immutable-data,@typescript-eslint/no-empty-function
Utils.createDiv =( () => {}) as any

// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars
declare namespace Global {
    type requestAnimationFrame = typeof setImmediate
    type cancelAnimationFrame = typeof clearImmediate
}

// eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-explicit-any
global.requestAnimationFrame = setImmediate as any;
// eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-explicit-any
global.cancelAnimationFrame = clearImmediate as any;

export * from "fcanvas"