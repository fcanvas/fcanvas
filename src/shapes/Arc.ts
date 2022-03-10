import {Shape, AttrsDefault} from "../Shape"
import { pointInCircle } from "../helpers/pointInCircle"
import { degressToRadius } from "../utils/degressToRadius"

type Attrs = AttrsDefault & {
	angle: number | {
		start: number;
		end: number
	}
	innerRadius?: number
	outerRadius: number
	clockwise?: boolean
}

export class Arc extends Shape<Attrs> {
	readonly type = "Arc"
	protected readonly attrsReactSize = ["angle", "innerRadius", "outerRadius", "clockwise"]
	
	protected _sceneFunc(context: CanvasRenderingContext2D) {
			const angleStart = degressToRadius(typeof this.attrs.angle === "object" ? this.attrs.angle.start : 0)
			const angleEnd = degressToRadius(typeof this.attrs.angle === "object" ? this.attrs.angle.end : this.attrs.angle)

			const sinStart = Math.sin(angleStart + Math.PI / 2)
			const cosStart = Math.cos(angleStart + Math.PI / 2)

			const sinEnd = Math.sin(angleEnd + Math.PI / 2)
			const cosEnd = Math.cos(angleEnd + Math.PI / 2)

			context.moveTo(
				this.getInnerWidth() / 2 + sinStart *( this.attrs.innerRadius ?? 0),
				this.getInnerHeight() / 2 - cosStart * (this.attrs.innerRadius ?? 0)
			)
			context.lineTo(
				this.getInnerWidth() / 2 + sinStart * this.attrs.outerRadius,
				this.getInnerHeight() / 2 - cosStart * this.attrs.outerRadius
			)

			if (this.attrs.innerRadius !== void 0) {
				context.arc(this.getInnerWidth() / 2, this.getInnerHeight() / 2, this.attrs.innerRadius, angleStart, angleEnd, this.attrs.clockwise)
			}

			context.moveTo(
				this.getInnerWidth() / 2 + sinEnd * (this.attrs.innerRadius ?? 0),
				this.getInnerHeight() / 2 - cosEnd * this.attrs.outerRadius
			)
			context.lineTo(
				this.getInnerWidth() / 2 + sinEnd * (this.attrs.innerRadius ?? 0),
				this.getInnerHeight() / 2 - cosEnd * this.attrs.outerRadius
			)
	}

	constructor(attrs: Attrs) {
		super(attrs)
	}

	public getInnerWidth() {
		return (this.attrs.outerRadius ?? this.attrs.innerRadius) * 2
	}
	public getInnerHeight() {
		return this.getInnerWidth()
	}

	protected isPressedPoint(x: number, y: number) {
		const w_2 = this.getInnerWidth() / 2
		const h_2 = this.getInnerHeight() /  2
		const angle = Math.atan2(x + w_2 - this.attrs.x, y + h_2 - this.attrs.y)
		const inAngle = Math.PI / 2 + degressToRadius(typeof this.attrs.angle === "object" ? this.attrs.angle.start : 0) <= angle && Math.PI / 2 + degressToRadius(typeof this.attrs.angle === "object" ? this.attrs.angle.end : this.attrs.angle) >= angle

		if (!inAngle) return false

		if (this.attrs.outerRadius !== void 0) {
			const inInnerBox = pointInCircle(x + w_2, y + h_2, this.attrs.x, this.attrs.y, this.attrs.outerRadius)
			const inOuterBox = pointInCircle(x + w_2, y + h_2, this.attrs.x, this.attrs.y, this.attrs.innerRadius)
			
			return inInnerBox === false && inOuterBox
		}

		return pointInCircle(x + w_2, y + h_2, this.attrs.x, this.attrs.y, this.attrs.innerRadius)
	}
}