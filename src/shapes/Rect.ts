import { Shape, AttrsDefault } from "../Shape"
import { TWO_PI } from "../constants/TWO_PI"
import { pointInBox } from "../helpers/pointInBox"

type Attrs = AttrsDefault & {
	width: number;
	height : number
}

export class Rect extends Shape<Attrs> {
	readonly type = "Rect"

	protected _sceneFunc(context: CanvasRenderingContext2D) {
		context.rect(0, 0, this.attrs.width, this.attrs.height)
	}
	constructor(attrs : Attrs) {
		super(attrs)
	}

	protected isPressedPoint(x: number, y: number) {
		return pointInBox(x, y, this.attrs.x, this.attrs.y, this.attrs.width, this.attrs.height)
	}
}