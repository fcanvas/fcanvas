export Label extends Group {
  private getText() {
    return this.find<Text>("text")[0]
  }
  private getTag() {
    return this.find<Tag>("tag")[0]
  }
  private sync() {
    const text = this.getText(),
      tag = this.getTag()
      let
      width,
      height,
      pointerDirection,
      pointerWidth,
      x,
      y,
      pointerHeight;

    if (text && tag) {
      { width,
      height } = text.getSelfRect()
      
      { pointerDirection,
      pointerWidth , 
      pointerHeight } = tag.attrs
      x = 0;
      y = 0;

      switch (pointerDirection) {
        case "up":
          x = width / 2;
          y = -1 * pointerHeight;
          break;
        case "right":
          x = width + pointerWidth;
          y = height / 2;
          break;
        case "down":
          x = width / 2;
          y = height + pointerHeight;
          break;
        case "left":
          x = -1 * pointerWidth;
          y = height / 2;
          break;
      }

      tag.attrs.x *= -1
      tag.attrs.y *= -1
      tag.attrs.width = width
      tag.attrs.height = height
      
      text.attrs.x *= -1
      text.attrs.y *= -1
    }
  }
}
