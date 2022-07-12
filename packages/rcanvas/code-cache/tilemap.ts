import type {
  LayerNormal,
  LayerObjectGroup,
  TilemapData
} from "./type/TilemapData"

class Tilemap {
  private layers: {
    layer: LayerNormal
    objectgroup: Pick<LayerObjectGroup, "objects" | "properties">
  }[] = []
  anims: Record<string, unknown>
  constructor(
    private image: HTMLImageElement,
    private tilemap: TilemapData,
    private tileWidth: number,
    private tileHeight: number
  ) {
    this.anims = {}
    // parse layer
    const layers = this.layers

    // eslint-disable-next-line functional/no-let
    for (let i = 0; i < tilemap.layers.length; i++) {
      const layer = tilemap.layers[i]

      if (layer.type !== "objectgroup") {
        const objectgroup =
          tilemap.layers[i + 1]?.type === "objectgroup"
            ? tilemap.layers[++i]
            : {
                objects: layer.objects || []
              }
        layers.push({
          layer: layer as LayerNormal,
          objectgroup: objectgroup as LayerObjectGroup
        })
      }
    }
  }

  getTileProperty(x: number, y: number, propName: string) {
    const data = this.layers[0].layer.data
    const tileset = this.tilemap.tilesets[0]
    const tid = data[y * this.tilemap.width + x]
    const tile = tileset.tiles.find((t) => t.id === tid - 1)

    if (tile?.properties) {
      const property = tile.properties.find((prop) => prop?.name == propName)

      if (property) return property.value
    }

    return null
  }

  createEnemies(data) {
    const obj = this
    const a = 2

    for (let i = 0; i < obj.length; i++) {
      let enemy

      switch (obj[i].name) {
        case "dragon":
          enemy = new Dragon(
            loader.get("enemies"),
            data.enemies,
            obj[i].x * a,
            obj[i].y * a,
            32,
            32,
            [0, 0, 32, 32]
          )

          break

        case "bat":
          enemy = new Bat(
            loader.get("enemies"),
            data.enemies,
            obj[i].x * a,
            obj[i].y * a,
            32,
            32,
            [6, 6, 20, 20]
          )

          break

        case "slime":
          enemy = new Slime(
            loader.get("enemies"),
            data.enemies,
            obj[i].x * a,
            obj[i].y * a,
            32,
            32,
            [4, 8, 24, 24]
          )

          break
      }

      enemy.orientation = obj[i].rotation ? -1 : 1

      enemies.push(enemy)
    }
  }

  display(camera, a = 0) {
    const data = this.tilemap.layers[a].data

    const tileset = this.tilemap.tilesets[0]

    for (let i = 0; i < data.length; i++) {
      const pos = new Vector(
        (i % this.tilemap.width) * this.tileWidth,
        Math.floor(i / this.tilemap.width) * this.tileHeight
      ).sub(camera.pos)

      if (
        pos.x > game.width ||
        pos.x < -this.tileWidth ||
        pos.y > game.height ||
        pos.y < -this.tileHeight
      )
        continue

      const tid = data[i]

      const tile = tileset.tiles.find((t) => t.id == tid - 1)

      let idx

      if (tile.animation != undefined) {
        // if not exists -> init

        if (this.anims[i] == undefined) this.anims[i] = { frame: 0, counter: 0 }

        // handle

        if ((this.anims[i].counter += 1) == 20) {
          if ((this.anims[i].frame += 1) == tile.animation.length)
            this.anims[i].frame = 0

          this.anims[i].counter = 0
        }

        idx = tile.animation[this.anims[i].frame].tileid
      } else {
        idx = tid - 1
      }

      ctx.drawImage(
        this.image,
        (idx % tileset.columns) * tileset.tilewidth,
        Math.floor(idx / tileset.columns) * tileset.tileheight,
        tileset.tilewidth,
        tileset.tileheight,
        pos.x,
        pos.y,
        this.tileWidth,
        this.tileHeight
      )
    }
  }
}

class Mover extends Sprite {
  constructor(image, data, x, y, w, h, hitbox) {
    super(image, data, x, y, w, h)

    this.vel = new Vector(0, 0)

    this.p1 = [hitbox[0], hitbox[1]]

    this.p2 = [hitbox[0] + hitbox[2], hitbox[1] + hitbox[3]]

    this.state = [0, 0, 0]

    this.speed = 0

    this.jump = 0

    this.g = 0
  }

  collide(other) {
    if (
      (this.pos.x + this.p1[0] - other.pos.x - other.p2[0]) *
        (this.pos.x + this.p2[0] - other.pos.x - other.p1[0]) >
        0 ||
      (this.pos.y + this.p1[1] - other.pos.y - other.p2[1]) *
        (this.pos.y + this.p2[1] - other.pos.y - other.p1[1]) >
        0
    )
      return false

    return true
  }

  collideX() {
    const [tw, th] = [tilemap.tileWidth, tilemap.tileHeight]

    const minY = Math.floor((this.pos.y + this.p1[1]) / th)
    const maxY = Math.floor((this.pos.y + this.p2[1] - 1) / th)
    const minX = Math.floor((this.pos.x + this.p1[0] - 1) / tw)
    const maxX = Math.floor((this.pos.x + this.p2[0]) / tw)

    let [left, right] = [false, false]

    for (let y = minY; y <= maxY; y++) {
      if (tilemap.getTileProperty(minX, y, "collide")) {
        left = true

        if (this.vel.x < 0) this.pos.x = minX * tw + tw - this.p1[0]

        break
      } else if (tilemap.getTileProperty(maxX, y, "collide")) {
        right = true

        if (this.vel.x > 0) this.pos.x = maxX * tw - this.p2[0]

        break
      }
    }

    return [left, right]
  }

  collideY() {
    const [tw, th] = [tilemap.tileWidth, tilemap.tileHeight]

    const minY = Math.floor((this.pos.y + this.p1[1] - 1) / th)
    const maxY = Math.floor((this.pos.y + this.p2[1]) / th)
    const minX = Math.floor((this.pos.x + this.p1[0]) / tw)
    const maxX = Math.floor((this.pos.x + this.p2[0] - 1) / tw)

    let [top, bottom] = [false, false]

    for (let x = minX; x <= maxX; x++) {
      if (tilemap.getTileProperty(x, minY, "collide")) {
        if (
          (this.pos.x + this.p2[0] - x * tw - 3) *
            (this.pos.x + this.p1[0] - x * tw - tw + 3) <
          0
        ) {
          top = true

          if (this.vel.y < 0) this.pos.y = minY * th + th - this.p1[1]
        }
      } else if (tilemap.getTileProperty(x, maxY, "collide")) {
        if (
          (this.pos.x + this.p2[0] - x * tw - 3) *
            (this.pos.x + this.p1[0] - x * tw - tw + 3) <
          0
        ) {
          bottom = true

          if (this.vel.y > 0) this.pos.y = maxY * th - this.p2[1]
        }
      } else if (tilemap.getTileProperty(x, maxY, "lava")) {
        this.dead = true
      }
    }

    let [left2, right2] = [false, false]

    if (bottom) {
      if (tilemap.getTileProperty(minX, maxY, "collide") == false) left2 = true
      else if (tilemap.getTileProperty(maxX, maxY, "collide") == false)
        right2 = true
    }

    return [top, bottom, left2, right2]
  }

  updateMovement(dt) {
    const [top, bottom, left2, right2] = this.collideY()

    const [left, right] = this.collideX()

    if (this.state[0] == -1 && left == false) this.vel.x = -this.speed
    else if (this.state[0] == 1 && right == false) this.vel.x = this.speed
    else this.vel.x = 0

    if (this.state[1] && bottom) this.vel.y = -this.jump

    if (bottom == false) this.vel.y += this.g * dt
    else if (this.vel.y > 0) this.vel.y = 0

    if (top && this.vel.y < 0) this.vel.y = 0

    switch (this.state[0]) {
      case -1:
        this.orientation = -1

        break

      case 1:
        this.orientation = 1

        break
    }

    this.pos = this.pos.add(this.vel.mult(dt))

    return [left, right, top, bottom, left2, right2]
  }
}
