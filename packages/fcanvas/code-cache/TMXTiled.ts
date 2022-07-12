import { tmx } from "tmx-tiledmap"

import { Camera } from "./Camera"
import type { Shape } from "./Shape"

export class TMXTiled<Entities extends Record<string, typeof Shape>> {
  private tileWidth = 0
  private tileHeight = 0
  private width = 0
  private height = 0
  private tiles: Record<number, unknown> = {}
  private entities: Entities
  private objects: Shape[] = []
  private image?: HTMLImageElement

  public resolution = {
    x: 0,
    y: 0
  }

  public camera: Camera = new Camera(this)

  constructor(entities: Entities) {
    this.entities = entities
  }

  async setup(path: string) {
    const { layers, tilesets, tilewidth, tileheight, width, height } =
      await tmx(path)

    this.setDimensions(width, height, tilewidth, tileheight)
    this.addTileset(tilesets[0], "tileset.png")
    this.createLayers([
      Background,
      layers[0],
      Flash,
      layers[1],
      layers[2],
      layers[3],
      Overlay
    ])
  }

  public setDimensions(
    width: number,
    height: number,
    tileWidth: number,
    tileHeight: number
  ): void {
    this.tileWidth = tileWidth
    this.tileHeight = tileHeight
    this.width = width
    this.height = height
    this.camera.setBounds(0, 0, width * tileWidth, height * tileHeight)
  }

  addTileset(tileset: TMXTileset, image: string): void {
    tileset = { ...tileset, image }
    // eslint-disable-next-line functional/no-let
    for (let i = 0; i < tileset.tilecount; i++) {
      // eslint-disable-next-line functional/immutable-data
      this.tiles[i + tileset.firstgid] = new Tile(
        i + tileset.firstgid,
        tilesetv,
        this.game
      )
    }
  }

  createLayers(layers: (Constructable<Layer> | TMXLayer)[]): void {
    this.layers = []
    layers.forEach((l) => this.addLayer(l))
  }

  addLayer(l: Constructable<Layer> | TMXLayer): void {
    if (typeof l === "function") {
      this.layers.push(new l(null, this.game))
    } else {
      this.layers.push(new Layer(l, this.game))
      l.objects &&
        l.objects.forEach((obj) =>
          this.addObject(obj.type, { ...obj, layerId: l.id })
        )
    }
  }

  addObject<Type extends keyof Entities>(
    type: Type,
    props: ConstructorParameters<Entities[Type]>[0],
    index?: number
  ) {
    const Model = this.entities[type]
    const entity = new Model({
      ...props,
      image: this.image
    })

    if (index !== undefined) this.objects.splice(index, 0, entity)
    else this.objects.push(entity)

    return entity
  }

  createSprite(id: string, width: number, height: number): Sprite {
    return new Sprite(id, width, height, this.game)
  }
}
