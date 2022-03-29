const fcanvas = require("fcanvas")
const { DOMMatrix, Image, createCanvas } = require("canvas")
const Path2D = require("path2d-polyfill")

fcanvas.Utils.DOMMatrix = DOMMatrix
fcanvas.Utils.Path2D = Path2D
fcanvas.Utils.Image = Image;
fcanvas.Utils.document = {
    getElementById() {}
}
fcanvas.Utils.createCanvas = () => createCanvas(300, 300)
fcanvas.Utils.createDiv = () => {}

global.requestAnimationFrame = setImmediate
global.cancelAnimationFrame = clearImmediate

module.exports = fcanvas