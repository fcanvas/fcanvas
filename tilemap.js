class Tilemap {

  constructor(image, data, tileWidth, tileHeight) {

    this.image = image;

    this.tilemap = data;

    this.tileWidth = tileWidth;

    this.tileHeight = tileHeight;

    this.anims = {};

  }



  getTileProperty(x, y, propName) {

    const data = this.tilemap.layers[0].data;

    const tileset = this.tilemap.tilesets[0];

    const tid = data[y * this.tilemap.width + x];

    const tile = tileset.tiles.find(t => t.id == tid - 1);

    if (tile["properties"] != undefined) {

      const property = tile.properties.find(prop => prop.name == propName);

      if (property != null) {

        return property.value;

      }

    }

    return null;

  }



  createEnemies(data) {

    const obj = this.tilemap.layers[1].objects;

    const a = 2;

    for (let i = 0; i < obj.length; i++) {

      let enemy;

      switch (obj[i].name) {

        case "dragon":

          enemy = new Dragon(loader.get("enemies"), data["enemies"], obj[i].x * a, obj[i].y * a, 32, 32, [0, 0, 32, 32]);

          break;

        case "bat":

          enemy = new Bat(loader.get("enemies"), data["enemies"], obj[i].x * a, obj[i].y * a, 32, 32, [6, 6, 20, 20]);

          break;

        case "slime":

          enemy = new Slime(loader.get("enemies"), data["enemies"], obj[i].x * a, obj[i].y * a, 32, 32, [4, 8, 24, 24]);

          break;

      }

      enemy.orientation = obj[i].rotation ? -1 : 1;

      enemies.push(enemy);

    }

  }



  display(camera, a = 0) {

    const data = this.tilemap.layers[a].data;

    const tileset = this.tilemap.tilesets[0];

    for (let i = 0; i < data.length; i++) {

      let pos = new Vector(i % this.tilemap.width * this.tileWidth, Math.floor(i / this.tilemap.width) * this.tileHeight).sub(camera.pos);

      if (pos.x > game.width || pos.x < -this.tileWidth || pos.y > game.height || pos.y < -this.tileHeight) {

        continue;

      }

      let tid = data[i];

      let tile = tileset.tiles.find(t => t.id == tid - 1);

      let idx;

      if (tile["animation"] != undefined) {

        // if not exists -> init

        if (this.anims[i] == undefined) {

          this.anims[i] = { frame: 0, counter: 0 };

        }

        // handle

        if ((this.anims[i].counter += 1) == 20) {

          if ((this.anims[i].frame += 1) == tile.animation.length) {

            this.anims[i].frame = 0;

          }

          this.anims[i].counter = 0;

        }

        idx = tile.animation[this.anims[i].frame].tileid;

      } else {

        idx = tid - 1;

      }

      ctx.drawImage(this.image, idx % tileset.columns * tileset.tilewidth, Math.floor(idx / tileset.columns) * tileset.tileheight, tileset.tilewidth, tileset.tileheight, pos.x, pos.y, this.tileWidth, this.tileHeight);

    }

  }







}
