// classes

// loader

class Loader {



  constructor() {

    this.resources = new Object();

  }



  get(key) {

    return this.resources[key];

  }



  load(objSrc) {

    const loads = [];

    const keys = [];

    for (let key in objSrc) {

      keys.push(key);

      let src = objSrc[key];

      if (src.match(/\.mp3|\.ogg|\.wav/)) {

        loads.push(loadAudio(src));

      } else if (src.match(/\.png|\.jpg|\.jpeg/)) {

        loads.push(loadImage(src));

      } else if (src.match(/\.json/)) {

        loads.push(loadJSON(src));

      }

    }

    return Promise.all(loads).then(items => {



      items.forEach((item, i) => {

        this.resources[keys[i]] = item;

      });

    });

  }



}

function loadAudio(src) {

  return new Promise(resolve => {

    const audio = new Audio();

    audio.src = src;

    audio.oncanplay = function() {



      resolve(audio);

    }

  });

}

function loadImage(src) {

  return new Promise(resolve => {

    const image = new Image();

    image.src = src;

    image.onload = function() {



      resolve(image);

    }

  });

}

function loadJSON(src) {

  return new Promise(resolve => {

    resolve(fetch(src));

  }).then(text => {

    return text.json();

  });

}

// vector

class Vector {

  constructor(x, y) {

    this.x = x;

    this.y = y;

  }

  add(v1) {

    return new Vector(this.x + v1.x, this.y + v1.y);

  }

  sub(v1) {

    return new Vector(this.x - v1.x, this.y - v1.y);

  }

  mult(a) {

    return new Vector(this.x * a, this.y * a);

  }

}

// camera

class Camera {

  constructor(x, y) {

    this.pos = new Vector(x, y);

  }

  follow(obj, offsetX, offsetY) {

    this.pos.x = obj.pos.x - offsetX;

    this.pos.y = obj.pos.y - offsetY;

  }

}

// sprite

class Sprite {

  constructor(image, data, x, y, w, h) {

    this.image = image;

    this.data = data;

    this.pos = new Vector(x, y);

    this.w = w;

    this.h = h;

    this.orientation = 1;

    this.anim = null;

  }

  playAnim(name, rate, repeat = true) {

    this.anim = {

      name: name,

      counter: 0,

      frame: 0,

      frameset: this.data.anims[name],

      rate: rate,

      repeat: repeat,

      paused: false

    };

  }

  getAnim() {

    return this.anim.name;

  }

  updateAnim() {

    if (this.anim == null || this.anim.paused) return;

    if ((this.anim.counter += 1) == this.anim.rate) {

      if ((this.anim.frame += 1) == this.anim.frameset.length) {

        if (this.anim.repeat) {

          this.anim.frame = 0;

        } else {

          this.anim.paused = true;

          this.anim.frame--;

          return;

        }

      }

      this.anim.counter = 0;

    }

  }

  display(camera) {

    const pos = this.pos.sub(camera.pos);

    if (pos.x > game.width || pos.x < -this.w || pos.y > game.height || pos.y < -this.h) {

      return;

    }

    if (this.anim == null) return;

    this.updateAnim();

    var frame = this.anim.frameset[this.anim.frame];

    ctx.save();

    ctx.translate(pos.x + this.w / 2, pos.y + this.h / 2);

    ctx.scale(this.orientation, 1);

    ctx.drawImage(this.image, frame % this.data.width * this.data.tileWidth, Math.floor(frame / this.data.width) * this.data.tileHeight, this.data.tileWidth, this.data.tileHeight, -this.w / 2, -this.h / 2, this.w, this.h);

    ctx.restore();

  }

}

// mover

class Mover extends Sprite {

  constructor(image, data, x, y, w, h, hitbox) {

    super(image, data, x, y, w, h);

    this.vel = new Vector(0, 0);

    this.p1 = [hitbox[0], hitbox[1]];

    this.p2 = [hitbox[0] + hitbox[2], hitbox[1] + hitbox[3]];

    this.state = [0, 0, 0];

    this.speed = 0;

    this.jump = 0;

    this.g = 0;

  }



  collide(other) {

    if ((this.pos.x + this.p1[0] - other.pos.x - other.p2[0]) * (this.pos.x + this.p2[0] - other.pos.x - other.p1[0]) > 0 || (this.pos.y + this.p1[1] - other.pos.y - other.p2[1]) * (this.pos.y + this.p2[1] - other.pos.y - other.p1[1]) > 0) return false;

    return true;

  }



  collideX() {

    const [tw, th] = [tilemap.tileWidth, tilemap.tileHeight];

    const minY = Math.floor((this.pos.y + this.p1[1]) / th),

      maxY = Math.floor((this.pos.y + this.p2[1] - 1) / th),

      minX = Math.floor((this.pos.x + this.p1[0] - 1) / tw),

      maxX = Math.floor((this.pos.x + this.p2[0]) / tw);

    let [left, right] = [false, false];



    for (let y = minY; y <= maxY; y++) {

      if (tilemap.getTileProperty(minX, y, "collide")) {

        left = true;

        if (this.vel.x < 0) {

          this.pos.x = minX * tw + tw - this.p1[0];

        }

        break;

      } else if (tilemap.getTileProperty(maxX, y, "collide")) {

        right = true;

        if (this.vel.x > 0) {

          this.pos.x = maxX * tw - this.p2[0];

        }

        break;

      }

    }



    return [left, right];

  }

  collideY() {

    const [tw, th] = [tilemap.tileWidth, tilemap.tileHeight];

    const minY = Math.floor((this.pos.y + this.p1[1] - 1) / th),

      maxY = Math.floor((this.pos.y + this.p2[1]) / th),

      minX = Math.floor((this.pos.x + this.p1[0]) / tw),

      maxX = Math.floor((this.pos.x + this.p2[0] - 1) / tw);

    let [top, bottom] = [false, false];



    for (let x = minX; x <= maxX; x++) {

      if (tilemap.getTileProperty(x, minY, "collide")) {

        if ((this.pos.x + this.p2[0] - x * tw - 3) * (this.pos.x + this.p1[0] - x * tw - tw + 3) < 0) {

          top = true;

          if (this.vel.y < 0) {

            this.pos.y = minY * th + th - this.p1[1];

          }

        }



      } else if (tilemap.getTileProperty(x, maxY, "collide")) {





        if ((this.pos.x + this.p2[0] - x * tw - 3) * (this.pos.x + this.p1[0] - x * tw - tw + 3) < 0) {

          bottom = true;

          if (this.vel.y > 0) {

            this.pos.y = maxY * th - this.p2[1];

          }

        }

      } else if (tilemap.getTileProperty(x, maxY, "lava")) {

        this.dead = true;

      }

    }



    let [left2, right2] = [false, false];

    if (bottom) {

      if (tilemap.getTileProperty(minX, maxY, "collide") == false) {

        left2 = true;

      } else if (tilemap.getTileProperty(maxX, maxY, "collide") == false) {

        right2 = true;

      }

    }



    return [top, bottom, left2, right2];

  }



  updateMovement(dt) {

    let [top, bottom, left2, right2] = this.collideY();

    let [left, right] = this.collideX();







    if (this.state[0] == -1 && left == false) {

      this.vel.x = -this.speed;

    } else if (this.state[0] == 1 && right == false) {

      this.vel.x = this.speed;

    } else {

      this.vel.x = 0;

    }



    if (this.state[1] && bottom) {

      this.vel.y = -this.jump;

    }



    if (bottom == false) {

      this.vel.y += this.g * dt;

    } else if (this.vel.y > 0) {

      this.vel.y = 0;

    }



    if (top && this.vel.y < 0) {

      this.vel.y = 0;

    }



    switch (this.state[0]) {

      case -1:

        this.orientation = -1;

        break;

      case 1:

        this.orientation = 1;

        break;

    }







    this.pos = this.pos.add(this.vel.mult(dt));

    return [left, right, top, bottom, left2, right2];

  }



}

class Player extends Mover {

  constructor(image, data, x, y, w, h, hitbox) {

    super(image, data, x, y, w, h, hitbox);

    this.speed = 3;

    this.jump = 5;

    this.g = 0.2

    this.dead = false;

    this.playAnim("idle", 10);



  }





  handleAnim(bottom) {

    if (bottom == false && this.getAnim() != "jump") {

      this.playAnim("jump", 10);

    } else if (bottom) {

      if (this.state[0] && this.getAnim() != "run") {

        this.playAnim("run", 10);

      } else if (this.state[0] == 0 && this.getAnim() != "idle") {

        this.playAnim("idle", 10);

      }

    }

  }



  update(dt) {

    let bottom = this.updateMovement(dt)[3];

    this.handleAnim(bottom);

    if ((this.pos.x + this.p2[0] - finish[0]) * (this.pos.x + this.p1[0] - finish[0]) < 0 && (this.pos.y + this.p2[1] - finish[1]) * (this.pos.y + this.p1[1] - finish[1]) < 0) {

      document.getElementById("title").innerHTML = "you escaped";

      document.getElementById("loader").style.display = "flex";

      player.pos.x = start[0];

      player.pos.y = start[1];

      t = false;

      setTimeout(() => t = true, 1000);

    } else if (this.dead) {

      document.getElementById("title").innerHTML = "you died";

      document.getElementById("loader").style.display = "flex";

      player.pos.x = start[0];

      player.pos.y = start[1];

      this.dead = false;

      t = false;

      setTimeout(() => t = true, 1000);

    }

  }

}

// enemies

class Slime extends Mover {

  constructor(image, data, x, y, w, h, hitbox) {

    super(image, data, x, y, w, h, hitbox);

    this.speed = 1;

    this.jump = 0;

    this.g = 0.2;



    this.playAnim("slime", 10);

    this.state[0] = 1;

  }



  update(dt) {

    let collide = this.updateMovement(dt);

    if (collide[0] || collide[4]) {

      this.state[0] = 1;

    } else if (collide[1] || collide[5]) {

      this.state[0] = -1;

    }

    if (this.collide(player)) {

      player.dead = true;

    }

  }



}

class Bat extends Mover {

  constructor(image, data, x, y, w, h, hitbox) {

    super(image, data, x, y, w, h, hitbox);

    this.speed = 3;

    this.jump = 0;

    this.g = 0;



    this.playAnim("bat", 10);

    this.state[0] = 1;



  }



  update(dt) {

    let collide = this.updateMovement(dt);

    if (collide[0]) {

      this.state[0] = 1;

    } else if (collide[1]) {

      this.state[0] = -1;

    }

    if (this.collide(player)) {

      player.dead = true;

    }

  }



}

class Dragon extends Mover {

  constructor(image, data, x, y, w, h, hitbox) {

    super(image, data, x, y, w, h, hitbox);

    this.speed = 0;

    this.jump = 0;

    this.g = 0.2;

    this.counter = 0;

    this.rate = 150;



    this.playAnim("dragon", 10);



  }

  update(dt) {

    if (this.anim.paused) {

      this.playAnim("dragon", 10);

    }

    if ((this.counter += dt) >= this.rate) {

      this.counter = 0;

      this.playAnim("dragon2", 10, false);

      let fb = new Fireball(loader.get("items"), data["items"], this.pos.x, this.pos.y, 32, 32, [12, 12, 12, 12]);

      fb.state[0] = this.orientation;

      fireballs.push(fb);

    }

    this.updateMovement(dt);

  }



}

// fireball

class Fireball extends Mover {

  constructor(image, data, x, y, w, h, hitbox) {

    super(image, data, x, y, w, h, hitbox);

    this.speed = 4;

    this.jump = 0;

    this.g = 0;



    this.playAnim("fireball", 10);

  }



  update(dt) {

    let collide = this.updateMovement(dt);

    if ((collide[0] || collide[1] || this.collide(player)) && this.getAnim() == "fireball") {

      this.state[0] = 0;

      this.playAnim("fireball2", 10, false);

      if (this.collide(player)) {

        player.dead = true;

      }

    }

  }



}

// tilemap

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

// constants

let t = true;

const start = [70, 380];

const finish = [10, 130];

const data = {

  "player": {

    width: 4,

    tileWidth: 16,

    tileHeight: 16,

    anims: {

      "run": [0, 1, 2, 1],

      "idle": [5],

      "jump": [4]

    }

  },

  "enemies": {

    width: 4,

    tileWidth: 16,

    tileHeight: 16,

    anims: {

      "slime": [0, 1, 2, 2, 0],

      "dragon": [4, 5, 6],

      "dragon2": [7],

      "bat": [10, 8, 9]

    }

  },

  "items": {

    width: 4,

    tileWidth: 16,

    tileHeight: 16,

    anims: {

      "fireball": [8, 9],

      "fireball2": [10, 11]

    }

  }

};

// game loop

function animate() {

  const current = performance.now();

  if (!window.last) {

    last = current;

  }

  let dt = (current - last) / (1000 / 60);

  if (dt > 50) {

    dt = 0;

  }



  update(dt);

  render(mainCamera);



  last = current;



  requestAnimationFrame(animate);

}

function update(dt) {

  for (let i = 0; i < fireballs.length; i++) {

    fireballs[i].update(dt);

    if (fireballs[i].anim.paused) {

      fireballs.splice(i--, 1);

    }

  }

  player.update(dt);

  for (let i = 0; i < enemies.length; i++) {

    enemies[i].update(dt);

  }





}

function render(camera) {



  camera.follow(player, game.width / 2, game.height / 2);

  ctx.clearRect(0, 0, game.width, game.height);



  tilemap.display(camera);



  for (let i = 0; i < fireballs.length; i++) {

    fireballs[i].display(camera);

  }



  player.display(camera);

  for (let i = 0; i < enemies.length; i++) {

    enemies[i].display(camera);

  }

}

// main func

function preload() {

  loader = new Loader();

  loader.load({

    "tileset": "https://raw.githubusercontent.com/dada542/just-platformer-game/main/tiles.png",

    "player": "https://raw.githubusercontent.com/dada542/just-platformer-game/main/player.png",

    "enemies": "https://raw.githubusercontent.com/dada542/just-platformer-game/main/enemies.png",

    "items": "https://raw.githubusercontent.com/dada542/just-platformer-game/main/items.png",

    "tilemap": "https://raw.githubusercontent.com/dada542/just-platformer-game/main/mapa4.json",

    /*"music": "https://raw.githubusercontent.com/dada542/just-platformer-game/main/04%20-%20the%20croutonian%20ship.mp3"*/

  }).then(() => {

    main();

  });

}

function getLikes() {

  const xhttp = new XMLHttpRequest();

  const parser = new DOMParser();

  xhttp.open("GET", "https://cors-anywhere.herokuapp.com/https://code.sololearn.com/WuTAHIogb4b2/", true);

  xhttp.send();

  return new Promise(resolve => {

    xhttp.onreadystatechange = function() {

      if (this.readyState == 4 && this.status == 200) resolve(this.responseText);

    }

  }).then(page => {

    const likes = parser.parseFromString(page, "text/html").querySelector(".positive").innerHTML;

    document.getElementById("likes").innerHTML = "Likes for 2nd part: " + likes.slice(1) + "/200";

    main();

  });

}

function main() {



  music = document.getElementById("music"); //loader.get("music");

  document.getElementById("loader-text").innerHTML = "click to play";

  document.getElementById("loader").onclick = function() {

    if (t == false) return;

    if (music.paused) {

      music.play();

      music.loop = true;

    }



    this.style.display = "none";

  }



  // init game

  button1 = document.getElementById("button1");

  button2 = document.getElementById("button2");

  button3 = document.getElementById("button3");

  button4 = document.getElementById("button4");

  game = document.getElementById("game");

  game.width = innerWidth;

  game.height = innerHeight;

  ctx = game.getContext("2d");



  ctx.imageSmoothingEnabled = false;



  mainCamera = new Camera(0, 0);



  tilemap = new Tilemap(loader.get("tileset"), loader.get("tilemap"), 32, 32);



  fireballs = [];

  enemies = [];



  player = new Player(loader.get("player"), data["player"], start[0], start[1], 32, 32, [6, 0, 20, 32]);



  tilemap.createEnemies(data);



  // events



  addEventListener("resize", () => {

    game.width = innerWidth;

    game.height = innerHeight;

    ctx.imageSmoothingEnabled = false;

  });



  // buttons

  button1.addEventListener("ontouchstart" in document ? "touchstart" : "mousedown", e => {

    player.state[0] = -1;

  });

  button1.addEventListener("ontouchstart" in document ? "touchend" : "mouseup", e => {

    player.state[0] = 0;

  });



  button2.addEventListener("ontouchstart" in document ? "touchstart" : "mousedown", e => {

    player.state[0] = 1;

  });

  button2.addEventListener("ontouchstart" in document ? "touchend" : "mouseup", e => {

    player.state[0] = 0;

  });



  button4.addEventListener("ontouchstart" in document ? "touchstart" : "mousedown", e => {

    player.state[1] = 1;

  });



  button4.addEventListener("ontouchstart" in document ? "touchend" : "mouseup", e => {



    player.state[1] = 0;

  });

  // keyboard

  addEventListener("keydown", e => {

    switch (e.key) {

      case "a":

        player.state[0] = -1;

        break;

      case "w":

        player.state[1] = 1;

        break;

      case "d":

        player.state[0] = 1;

        break;

    }

  });



  addEventListener("keyup", e => {

    switch (e.key) {

      case "a":

        player.state[0] = 0;

        break;

      case "w":

        player.state[1] = 0;

        break;

      case "d":

        player.state[0] = 0;

        break;

    }

  });



  // loop game



  requestAnimationFrame(animate);



}

onload = preload;
