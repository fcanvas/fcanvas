interface Flips {
  H: boolean
  V: boolean
  D: boolean
}
interface TObject {
  shape: string
  properties?: Record<string, unknown>
  id: number
  name: string
  type: string
  x: number
  y: number
  width: number
  height: number
  gid?: number
  flips?: Flips
}
export interface LayerNormal {
  flips: Flips[]
  type: string
  visible?: 1 | 0
  properties?: Record<string, unknown>
  id: number
  name: string
  width: number
  height: number
  data: number[]
  objects?: TObject[]
}
export interface LayerObjectGroup extends Omit<LayerNormal, "data"> {
  type: "objectgroup"
  objects: TObject[]
}
interface TileStatic {
  id: number
  type: string
  properties?: (Record<string, unknown> | void)[]
}
interface TileAnimation {
  id: number
  animation: {
    frames: {
      titleid: number
      duration: number
    }[]
  }
  properties?: (Record<string, unknown> | void)[]
}

export interface TilemapData {
  layers: (LayerNormal | LayerObjectGroup)[]
  tilesets: {
    firstgid: number
    name: string
    tilewidth: number
    tileheight: number
    tilecount: number
    columns: number
    image: {
      source: string
      width: number
      height: number
    }
    tiles: (TileStatic | TileAnimation)[]
  }[]
  version: number
  tiledversion: string
  orientation: string
  renderorder: string
  compressionlevel: number
  width: number
  height: number
  tilewidth: number
  tileheight: number
  infinite: number
  nextlayerid: number
  nextobjectid: number
}
