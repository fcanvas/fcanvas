class Tween<Node extends (Shape<any, any, any> | Group | Label | Layer)> {
  private tween: Tween
  constructor(attrs: {
    node: Node,
    attrs: typeof Node["attrs"],
    duration: number
    easing?: (k: number) => number
    onUpdate?: () => void
    onFinish?: () => voud
  }) {
    this.tween = new Tween(attrs.node.attrs)
    .to(attrs.attrs, attrs.duration)
    .easing(attrs.easing ?? Easing.Linear.None)
  }
}
