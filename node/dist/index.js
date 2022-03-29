"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("canvas");
const fcanvas_1 = require("fcanvas");
// import Path2D from "path2d-polyfill"
// eslint-disable-next-line functional/immutable-data
fcanvas_1.Utils.DOMMatrix = canvas_1.DOMMatrix;
// eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-explicit-any
fcanvas_1.Utils.Path2D = class {
};
// eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-explicit-any
fcanvas_1.Utils.Image = canvas_1.Image;
// eslint-disable-next-line functional/immutable-data
fcanvas_1.Utils.document = {
    getElementById() {
        return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
};
// eslint-disable-next-line functional/immutable-data
fcanvas_1.Utils.createCanvas = () => (0, canvas_1.createCanvas)(300, 300);
// eslint-disable-next-line @typescript-eslint/no-explicit-any, functional/immutable-data,@typescript-eslint/no-empty-function
fcanvas_1.Utils.createDiv = (() => { });
// eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-explicit-any
global.requestAnimationFrame = setImmediate;
// eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-explicit-any
global.cancelAnimationFrame = clearImmediate;
__exportStar(require("fcanvas"), exports);
