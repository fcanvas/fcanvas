type Attrs<Animations> = {
  image: HTMLImageElement,
  animations: Animations;
  animation: keyof Animations;
  frameIndex?: number; // 0
  frameRate?: number // 17
}

export class Sprite extends Shape {
  static readonly type = "Sprite";
  static readonly attrsReactSize = [
    "image",
      "animations",
    "animation",
    "frameIndex",
    "frameRate"
  ];
  
  private cropImageCache = new Map<keyof Animations,Map<number, HTMLCanvasElement>>();
  private timeout?: NodeJS.Timeout | number
  private _isRunning = false
  
  private createCropImage() : HTMLCanvasElement {
    const _frameIndex = this.attrs.frameIndex ?? 0
    const cropImageInCache = this.cropImageCache.get(this.attrs.animation)?.get(_frameIndex)
    
    if (cropImageInCache) return cropImageInCache
    
    if (!this.cropImageCache.has(this.attrs.animation)) {
      this.cropImageCache.set(this.attrs.animation, new Map())
    }
    const animation = this.attrs.animations[this.attrs.animation]
    const frameLength = ~~animation.length / 4
    const frameIndex = _frameIndex > frameLength ? _frameIndex % frameLength - 1 : _frameIndex < 0 ? frameLength + _frameIndex + 1 : _frameIndex
    
    const cropImageNow = cropImage(this.attrs.image, ...animation.slice(frameIndex, frameIndex + 4))
    
    this.cropImageCache.get(this.attrs.animation)!.set(_frameIndex, cropImageNow)
    
    return cropImageNow
  }
  
  constructor(attrs) {
    super(attrs, prop => {
      if (prop.startsWith("animations.")) {
        // example: animations.moving.0
        // example: animations.moving.1
        // example: animations.moving.2
        // example: animations.moving.3
        const spl = prop.split(".")
        if (spl.length === 2) {
          this.cropImageCache.get(spl[1])?.clear()
        } else if (spl.length === 3) {
          this.cropImageCache.get(spl[1])?.delete(spl[2])
        }
      }
    })
  }
  
  protected _sceneFunc(context: CanvasRenderingContext2D) {
    if (this.hasFill() || this.hasStroke()) {
      context.beginPath();
      context.rect(0, 0, width, height);
      context.closePath();
      context.fillStrokeShape(this);
    }
    
    const crop = this.createCropImage()
    context.drawImage(crop, 0, 0)
  }
  
  public animation(name: keyof Animation) {
    this.attrs.anination = name
  }
  public start(): void {
    if (this._isRunning) return
    
    this._isRunning = true
    this.timeout = setTimeout(() => {
      let index = this.attrs.frameIndex++
      if (index > ~~this.attrs.animations[this.attrs.animation].length / 4) {
        index = 0
      }
      
      this.attrs.frameIndex = index
    }, 1000 / (this.attrs.frameRate ?? 17))
  }
  public stop(): void {
    clearTimeout(this.timeout)
    this.attrs.frameIndex = ~~this.animations[this.animation].length / 4
    this._isRunning = false
  }
  public isRunning() {
    return this._isRunning
  }
  
  protected size() {
    const { width, height } = this.createCropImage()
    return {
      width,
      height
    }
  }
}
