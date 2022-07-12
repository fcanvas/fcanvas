import { join } from "path/posix"
import { getImage, loadImage } from "./methods/loadImage"

/* eslint-disable functional/immutable-data */
const gamejs = require("../gamejs")

const base64 = require("./utils/base64")
const objects = require("./utils/objects")
const uri = require("./utils/uri")
const xml = require("./utils/xml")

const Map = (exports.Map = function (url) {
  url = uri.resolve(document.location.href, url)
  const xmlDoc = xml.Document.fromURL(url)
  const mapNode = xmlDoc.element("map")

  /**
   * Width of a single tile in pixels
   * @type Number
   */
  this.tileWidth = mapNode.attribute("tilewidth")
  /**
   * Height of a single tile in pixels
   * @type Number
   */
  this.tileHeight = mapNode.attribute("tileheight")
  /**
   * Width of the map in tiles
   * @type Number
   */
  this.width = mapNode.attribute("width")
  /**
   * Height of the map in tiles
   * @type Number
   */
  this.height = mapNode.attribute("height")

  const orientation = mapNode.attribute("orientation")
  if (orientation !== "orthogonal")
    throw new Error("only orthogonol maps supported")

  /**
   * Custom properties of the map
   */
  this.properties = {}
  setProperties(this.properties, mapNode)

  /**
   * All tiles of this map.
   * @type {TileSet}
   */
  this.tiles = new TileSets(mapNode, url)
  this.layers = loadLayers(mapNode)
  return this
})

/**
 * A Tile. Can not be instantiated. Get a Tile by calling `getTile(gid)`
 * on a `TileSets` instance.
 */
const Tile = (exports.Tile = function () {
  /**
   * @type {gamejs.graphics.Surface}
   */
  this.surface = null
  /**
   * @type {Object}
   */
  this.properties = null
  throw new Error("Can not be instantiated.")
})

interface Tilesets {
  firstgid: number
  name: string
  tilewidth: number
  tileheight: number
  tilecount: number
  columns: number
  spacing?: number
  image: {
    source: string
    width: number
    height: number
  }
  tiles: (
    | {
        id: number
        type: string
        probability: number
        animation?: undefined
      }
    | {
        id: number
        type: string
        probability?: undefined
        animation?: undefined
      }
    | {
        animation: {
          frames: {
            tileid: number
            duration: number
          }[]
        }
        id: number
        type?: undefined
        probability?: undefined
      }
  )[]
}

function loadTileSet(tileSetNode: Tilesets, cwd: string) {
  const tiles = []
  const {
    tilewidth: tileWidth,
    tileheight: tileHeight,
    spacing = 0
  } = tileSetNode
  // broken in tiled?
  const margin = 0

  const { image: imageNode } = tileSetNode
  const { source: imageAtlasFile } = imageNode

  const imageUrl = join(cwd, imageAtlasFile)
  const atlas = getImage(imageUrl)
  // FIXME set transparency if imageNode.attribute('trans') is set

  const { tiles: tileNodes } = tileSetNode
  const dims = [atlas.naturalWidth, atlas.naturalHeight]
  let y = 0
  while (y + tileHeight <= dims[1]) {
    // eslint-disable-next-line functional/no-let
    let x = 0
    while (x + tileWidth <= dims[0]) {
      tiles.push({
        surface: tileImage,
        properties: tileProperties
      })
      x += tileWidth + spacing
    }
    y += tileHeight + spacing
  }
  return tiles
}

class TileSets {
  constructor(private readonly tileSets: Tilesets, mapUrl) {
    const firstGid = tileSets.attribute("firstgid")
    const externalSource = tileSets.attribute("source")
    if (externalSource) {
      const tileSetDocument = xml.Document.fromURL(
        uri.resolve(mapUrl, externalSource)
      )
      tileSets = tileSetDocument.element("tileset")
    }
    tileSets.push({
      tiles: loadTileSet(tileSets),
      firstGid
    })

    tileSets.reverse()
  }

  getSurface(gid: number) {
    const tile = this.getTile(gid)
    return (tile && tile.surface) || null
  }

  getProperties(gid) {
    const tile = this.getTile(gid)
    return (tile && tile.properties) || {}
  }

  getTile(gid: number) {
    let tile = null
    tileSets.some(function (tileSet, idx) {
      if (tileSet.firstGid <= gid) {
        tile = tileSet.tiles[gid - tileSet.firstGid]
        return true
      }
      return false
    }, this)
    return tile
  }
}

/**
 * loadLayers
 */
const H_FLIP = 0x80000000
const V_FLIP = 0x40000000
var loadLayers = function (mapNode) {
  const layers = []

  const getGids = function (layerNode) {
    const dataNode = layerNode.element("data")
    const encoding = dataNode.attribute("encoding")
    const compression = dataNode.attribute("compression")
    let data = ""
    dataNode.children().forEach(function (textNode) {
      data += textNode.value()
    })
    let byteData = []
    if (encoding === "base64") {
      if (compression) throw new Error("Compression of map data unsupported")

      byteData = base64.decodeAsArray(data, 4)
    } else if (encoding === "csv") {
      data
        .trim()
        .split("\n")
        .forEach(function (row) {
          row.split(",", width).forEach(function (entry) {
            byteData.push(parseInt(entry, 10))
          })
        })
    } else {
      // FIXME individual XML tile elements
      throw new Error("individual tile format not supported")
    }
    return byteData
  }

  var width = mapNode.attribute("width")
  const height = mapNode.attribute("height")
  mapNode.elements("layer").forEach(function (layerNode) {
    // create empty gid matrix
    const gidMatrix = []
    let i = height
    while (i-- > 0) {
      let j = width
      gidMatrix[i] = []
      while (j-- > 0) gidMatrix[i][j] = 0
    }

    getGids(layerNode).forEach(function (gid, idx) {
      // FIXME flipX/Y currently ignored
      const flipX = gid & H_FLIP
      const flipY = gid & V_FLIP
      // clear flags
      gid &= ~(H_FLIP | V_FLIP)
      gidMatrix[parseInt(idx / width, 10)][parseInt(idx % width, 10)] = gid
    })
    layers.push({
      gids: gidMatrix,
      opacity: layerNode.attribute("opacity"),
      visible: layerNode.attribute("visible"),
      properties: setProperties({}, layerNode)
    })
  })
  return layers
}

/**
 * set generic <properties><property name="" value="">... on given object
 */
var setProperties = function (object, node) {
  const props = node.element("properties")
  if (!props) return

  props.elements("property").forEach(function (propertyNode) {
    const name = propertyNode.attribute("name")
    const value = propertyNode.attribute("value")
    object[name] = value
  })
  return object
}

const MapView = (exports.MapView = function (map) {
  this.timeout = 0

  this.layerViews = map.layers.map(function (layer) {
    return new LayerView(layer, {
      tileWidth: map.tileWidth,
      tileHeight: map.tileHeight,
      width: map.width,
      height: map.height,
      tiles: map.tiles
    })
  })
  this.viewRect = new gamejs.Rect(
    [0, 0],
    [map.width * map.tileWidth, map.height * map.tileWidth]
  )
  this.image = new gamejs.graphics.Surface([
    this.viewRect.width,
    this.viewRect.height
  ])
  this.mapImage = this.image.clone()
  this.redraw()
  return this
})

MapView.prototype.redraw = function () {
  this.layerViews.forEach(function (layer) {
    layer.draw(this.mapImage)
  }, this)
}

MapView.prototype.draw = function (display, offset) {
  display.blit(this.mapImage, offset || [0, 0], this.viewRect)
}

var LayerView = (exports.LayerView = function (layer, opts) {
  this.draw = function (display) {
    display.blit(this.surface)
  }
  /**
   * constructor
   */
  this.surface = new gamejs.graphics.Surface(
    opts.width * opts.tileWidth,
    opts.height * opts.tileHeight
  )
  this.surface.setAlpha(layer.opacity)

  /**
   * Note how below we look up the "gid" of the tile images in the TileSet from the Map
   * ('opt.tiles') to get the actual Surfaces.
   */
  layer.gids.forEach(function (row, i) {
    row.forEach(function (gid, j) {
      if (gid === 0) return

      const tileSurface = opts.tiles.getSurface(gid)
      if (tileSurface) {
        this.surface.blit(
          tileSurface,
          new gamejs.Rect(
            [j * opts.tileWidth, i * opts.tileHeight],
            [opts.tileWidth, opts.tileHeight]
          )
        )
      } else {
        gamejs.log("no gid ", gid, i, j, "layer", i)
      }
    }, this)
  }, this)
  return this
})
