import "./style.scss"

import { Layer, loadImage, Sprite, Stage } from "../../src/"

import DinoSprite from "./assets/dino-sprite.json"
import DinoSpriteImage from "./assets/dino-sprite.png"

const stage = new Stage({
  width: Math.min(600, window.innerWidth),
  height: 150,
  container: "app"
})

const main = new Layer()
stage.add(main)

// const trex = new Image({
//   x: 100,
//   y: 0,
//   image: cropImage(
//     await loadImage(DinoSpriteImage),
//     DinoSprite.original.LDPI.TREX.x,
//     DinoSprite.original.LDPI.TREX.y,
//     DinoSprite.original.TREX.WAITING_1.w,
//     DinoSprite.original.TREX.WAITING_1.h
//   )
// });
const { TREX, LDPI } = DinoSprite.original

const trex = new Sprite({
  x: 0,
  y: 0,
  image: await loadImage(DinoSpriteImage),
  animation: "waiting",
  animations: {
    waiting: [
      LDPI.TREX.x + TREX.WAITING_1.x,
      LDPI.TREX.y,
      TREX.WAITING_1.w,
      TREX.WAITING_1.h,

      LDPI.TREX.x + TREX.WAITING_2.x,
      LDPI.TREX.y,
      TREX.WAITING_2.w,
      TREX.WAITING_2.h
    ],
    running: [
      LDPI.TREX.x + TREX.RUNNING_1.x,
      LDPI.TREX.y,
      TREX.RUNNING_1.w,
      TREX.RUNNING_1.h,

      LDPI.TREX.x + TREX.RUNNING_2.x,
      LDPI.TREX.y,
      TREX.RUNNING_2.w,
      TREX.RUNNING_2.h
    ]
  }
})
trex.animation("running")
trex.start()

main.add(trex)
