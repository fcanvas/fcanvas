import { Shape, AttrsDefault } from "../Shape"
import { TWO_PI } from "../constants/TWO_PI"
import { pointInCircle } from "../helpers/pointInCircle"

type Attrs = AttrsDefault & {
	radius: number
}

export class Circle extends Shape<Attrs> {
	readonly type = "Circle"
	protected readonly attrsReactSize = ["radius"]
	
	protected _sceneFunc(context: CanvasRenderingContext2D) {
		context.arc(this.attrs.radius, this.attrs.radius, this.attrs.radius, 0, TWO_PI)
	}
	constructor(attrs : Attrs) {
		super(attrs)
	}

	public getInnerWidth() {
		return this.attrs.radius * 2
	}
	public getInnerHeight() {
		return this.attrs.radius * 2
	}

	protected isPressedPoint(x: number, y: number) {
		return pointInCircle(x + this.attrs.radius, y + this.attrs.radius, this.attrs.x, this.attrs.y, this.attrs.radius)
	}
}