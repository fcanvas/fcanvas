type AttrsCustom = {
  numPoints: number;
  innerRadius: number;
  outerRadius: number;
}

export class Star extends Shape {
  static readonly type = "Star";
  static readonly attrsReactSize = [
    "innerRadius",
    "outerRadius"
  ];
  
  protected _sceneFunc(context) {
    const { innerRadius,
      outerRadius ,
      numPoints } = this.attrs;
  
    
    context.moveTo(0, 0 - outerRadius);
  
    for (let n = 1; n < numPoints * 2; n++) {
      const radius = n % 2 === 0 ? outerRadius : innerRadius;
      const x = radius * Math.sin((n * Math.PI) / numPoints);
      const y = -1 * radius * Math.cos((n * Math.PI) / numPoints);
      context.lineTo(x, y);
    }
  
    this.fillStrokeScene(context);
  }
  protected size() {
    return {
      width: this.attrs.outerRadius * 2,
      height: this.attrs.outerRadius * 2,
    };
  }
}
