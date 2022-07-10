import type { Shape } from "./Shape"
import { Vector } from "./Vector"
import { BOUNCE_CLIENT_RECT } from "./symbols"
import type { Offset } from "./type/Offset"

class Box {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    public pos: Vector,
    public width: number,
    public height: number
  ) {}
}

interface Game {
  resolution: Offset
}

export class Camera {
  pos = new Vector()
  offset = new Vector()
  anchor = new Vector()
  speed = new Vector(1, 1)
  bounds?: Box
  follow?: Shape

  // eslint-disable-next-line no-useless-constructor
  constructor(public game: Game) {}

  public moveTo(x: number, y: number): void {
    this.pos = new Vector(-x, -y)
    this.anchor = this.pos.copy()
  }

  public center(): void {
    if (this.follow) {
      const { x, y } = this.follow.attrs
      const { width, height } = this.follow[BOUNCE_CLIENT_RECT].value

      this.moveTo(x + width / 2, y + height / 2)

      return
    }

    this.moveTo(this.game.resolution.x / 2, this.game.resolution.y / 2)
  }

  public getBounds(): Box {
    if (!this.bounds)
      this.setBounds(0, 0, this.game.resolution.x, this.game.resolution.y)

    return this.bounds as Box
  }

  public setBounds(x: number, y: number, width: number, height: number): void {
    this.bounds = new Box(new Vector(x, y), width, height)
  }

  public setSpeed(x: number, y = x): void {
    this.speed = new Vector(x, y)
  }

  public setOffset(x: number, y: number): void {
    this.offset = new Vector(-x, -y)
  }

  public setFollow(follow: Shape, center = true): void {
    this.follow = follow
    if (center) this.center()
  }
}
