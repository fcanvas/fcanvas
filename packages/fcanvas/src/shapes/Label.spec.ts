import "./test/setup-environment"

import { Layer, nextTick, Stage, Text } from ".."

import { Label } from "./Label"
import { Tag } from "./Tag"
import { compareLayerWithImage } from "./test/helpers/compareLayerWithImage"

describe("Label", () => {
  // ======================================================
  test("add label", async () => {
    const stage = new Stage({ autoDraw: false, width: 300, height: 300 })
    const layer = new Layer().addTo(stage)

    const tooltip = new Label({
      x: 170,
      y: 75,
      opacity: 0.75
    }).addTo(layer)

    new Tag({
      x: 0,
      y: 0,
      fill: "black",
      pointerDirection: "down",
      pointerWidth: 10,
      pointerHeight: 10,
      lineJoin: "round",
      shadow: {
        x: 10,
        y: 10,
        blur: 10,
        color: "red"
      }
    }).addTo(tooltip)
    new Text({
      x: 0,
      y: 0,
      text: "Tooltip pointing down",
      fontSize: 18,
      padding: 5,
      fill: "white"
    }).addTo(tooltip)

    // label with left pointer
    const labelLeft = new Label({
      x: 20,
      y: 130,
      opacity: 0.75
    })

    new Tag({
      x: 0,
      y: 0,
      fill: "green",
      pointerDirection: "left",
      pointerWidth: 20,
      pointerHeight: 28,
      lineJoin: "round"
    }).addTo(labelLeft)
    new Text({
      x: 0,
      y: 0,
      text: "Label pointing left",
      fontFamily: "Calibri",
      fontSize: 18,
      padding: 5,
      fill: "white"
    }).addTo(labelLeft)

    // simple label
    const simpleLabel = new Label({
      x: 180,
      y: 150,
      opacity: 0.75
    })

    new Tag({
      x: 0,
      y: 0,
      fill: "yellow"
    }).addTo(simpleLabel)
    new Text({
      x: 0,
      y: 0,
      text: "Simple label",
      fontFamily: "Calibri",
      fontSize: 18,
      padding: 5,
      fill: "black"
    }).addTo(simpleLabel)

    // add the labels to layer
    layer.add(tooltip)
    layer.add(labelLeft)
    layer.add(simpleLabel)

    await nextTick()

    layer.draw()

    expect(await compareLayerWithImage(layer, "label.png"))
    // save(layer, "label")
  })

  // // ======================================================
  // test("create label from json", () => {
  //   var stage = new Stage({ autoDraw: false })

  //   var json =
  //     '{"attrs":{"x":100,"y":100,"draggable":true},"className":"Label","children":[{"attrs":{"fill":"#bbb","shadowColor":"black","shadowBlur":10,"shadowOffsetX":10,"shadowOffsetY":10,"shadowOpacity":0.2,"lineJoin":"round","pointerDirection":"up","pointerWidth":20,"pointerHeight":20,"cornerRadius":5,"x":-151.5,"y":20,"width":303,"height":60},"className":"Tag"},{"attrs":{"text":"Hello big world","fontSize":50,"lineHeight":1.2,"fill":"green","width":"auto","height":"auto","x":-151.5,"y":20},"className":"Text"}]}'
  //   var layer = new Layer()

  //   var label = Node.create(json)

  //   layer.add(label)
  //   stage.add(layer)

  //   var trace = layer.getContext().getTrace(false, true)

  //   if (isBrowser) {
  //     assert.equal(
  //       trace,
  //       "clearRect(0,0,578,200);save();lineJoin=round;transform(1,0,0,1,-64,120);shadowColor=rgba(0,0,0,0.2);shadowBlur=10;shadowOffsetX=10;shadowOffsetY=10;beginPath();moveTo(5,0);lineTo(153,0);lineTo(163,-20);lineTo(173,0);lineTo(322,0);arc(322,5,5,4,0,false);lineTo(327,55);arc(322,55,5,0,1,false);lineTo(5,60);arc(5,55,5,1,3,false);lineTo(0,5);arc(5,5,5,3,4,false);closePath();fillStyle=#bbb;fill();restore();save();transform(1,0,0,1,-64,120);font=normal normal 50px Arial;textBaseline=middle;textAlign=left;translate(0,0);save();fillStyle=green;fillText(Hello big world,0,30);restore();restore();"
  //     )
  //   } else {
  //     assert.equal(
  //       trace,
  //       "clearRect(0,0,578,200);save();lineJoin=round;transform(1,0,0,1,-65,120);shadowColor=rgba(0,0,0,0.2);shadowBlur=10;shadowOffsetX=10;shadowOffsetY=10;beginPath();moveTo(5,0);lineTo(154,0);lineTo(164,-20);lineTo(174,0);lineTo(324,0);arc(324,5,5,4,0,false);lineTo(329,55);arc(324,55,5,0,1,false);lineTo(5,60);arc(5,55,5,1,3,false);lineTo(0,5);arc(5,5,5,3,4,false);closePath();fillStyle=#bbb;fill();restore();save();transform(1,0,0,1,-65,120);font=normal normal 50px Arial;textBaseline=middle;textAlign=left;translate(0,0);save();fillStyle=green;fillText(Hello big world,0,30);restore();restore();"
  //     )
  //   }
  // })

  // test("find label class", () => {
  //   var stage = new Stage({ autoDraw: false })
  //   var layer = new Layer()

  //   var label = new Label({
  //     x: 100,
  //     y: 100
  //   })

  //   // add a tag to the label
  //   label.add(
  //     new Tag({
  //       fill: "#bbb"
  //     })
  //   )

  //   // add text to the label
  //   label.add(
  //     new Text({
  //       text: "Test Label",
  //       fill: "green"
  //     })
  //   )

  //   layer.add(label)
  //   stage.add(layer)

  //   assert.equal(stage.find("Label")[0], label)
  // })

  // // caching doesn't give exactly the same result. WHY?
  // test("cache label", () => {
  //   var stage = new Stage({ autoDraw: false })
  //   var layer = new Layer()

  //   // tooltip
  //   var tooltip = new Label({
  //     x: 170,
  //     y: 75,
  //     opacity: 0.75
  //   })
  //   tooltip.add(
  //     new Tag({
  //       fill: "black",
  //       pointerDirection: "down",
  //       pointerWidth: 10,
  //       pointerHeight: 10,
  //       lineJoin: "round",
  //       shadowColor: "black",
  //       shadowBlur: 10,
  //       shadowOffsetX: 10,
  //       shadowOpacity: 0.5
  //     })
  //   )
  //   tooltip.add(
  //     new Text({
  //       text: "Tooltip pointing down",
  //       fontFamily: "Calibri",
  //       fontSize: 18,
  //       padding: 5,
  //       fill: "white"
  //     })
  //   )

  //   var tooltipUp = new Label({
  //     x: 170,
  //     y: 75,
  //     opacity: 0.75
  //   })
  //   tooltipUp.add(
  //     new Tag({
  //       fill: "black",
  //       pointerDirection: "up",
  //       pointerWidth: 10,
  //       pointerHeight: 10,
  //       lineJoin: "round",
  //       shadowColor: "black",
  //       shadowBlur: 10,
  //       shadowOffsetX: 10,
  //       shadowOpacity: 0.5
  //     })
  //   )
  //   tooltipUp.add(
  //     new Text({
  //       text: "Tooltip pointing up",
  //       fontFamily: "Calibri",
  //       fontSize: 18,
  //       padding: 5,
  //       fill: "white"
  //     })
  //   )
  //   // label with left pointer
  //   var labelLeft = new Label({
  //     x: 20,
  //     y: 130,
  //     opacity: 0.75
  //   })
  //   labelLeft.add(
  //     new Tag({
  //       fill: "green",
  //       pointerDirection: "left",
  //       pointerWidth: 30,
  //       pointerHeight: 28,
  //       lineJoin: "round"
  //     })
  //   )
  //   labelLeft.add(
  //     new Text({
  //       text: "Label pointing left",
  //       fontFamily: "Calibri",
  //       fontSize: 18,
  //       padding: 5,
  //       fill: "white"
  //     })
  //   )
  //   // label with left pointer
  //   var labelRight = new Label({
  //     x: 160,
  //     y: 170,
  //     offsetX: 20,
  //     opacity: 0.75
  //   })
  //   labelRight.add(
  //     new Tag({
  //       fill: "green",
  //       pointerDirection: "right",
  //       pointerWidth: 20,
  //       pointerHeight: 28,
  //       lineJoin: "round"
  //     })
  //   )
  //   labelRight.add(
  //     new Text({
  //       text: "Label right",
  //       fontFamily: "Calibri",
  //       fontSize: 18,
  //       padding: 5,
  //       fill: "white"
  //     })
  //   )
  //   // simple label
  //   var simpleLabel = new Label({
  //     x: 180,
  //     y: 150,
  //     opacity: 0.75
  //   })
  //   simpleLabel.add(
  //     new Tag({
  //       fill: "yellow"
  //     })
  //   )
  //   simpleLabel.add(
  //     new Text({
  //       text: "Simple label",
  //       fontFamily: "Calibri",
  //       fontSize: 18,
  //       padding: 5,
  //       fill: "black"
  //     })
  //   )
  //   // add the labels to layer
  //   layer.add(tooltip, tooltipUp, labelLeft, labelRight, simpleLabel)
  //   layer.children.forEach((child) => child.cache())

  //   stage.add(layer)

  //   cloneAndCompareLayer(layer, 250, 100)
  // })

  // test("tag should list text size changes", () => {
  //   var stage = new Stage({ autoDraw: false })
  //   var layer = new Layer()
  //   stage.add(layer)

  //   var label = new Label()

  //   var tag = new Tag({
  //     stroke: "black"
  //   })

  //   label.add(tag)

  //   var text = new Text({
  //     text: "hello hello hello hello hello hello hello hello"
  //   })
  //   label.add(text)

  //   layer.add(label)
  //   layer.draw()

  //   text.width(200)

  //   layer.draw()
  //   assert.equal(tag.width(), text.width())

  //   text.height(200)
  //   assert.equal(tag.height(), text.height())
  // })

  // test("tag cornerRadius", () => {
  //   var stage = new Stage({ autoDraw: false })
  //   var layer = new Layer()

  //   var tag = new Tag({
  //     x: 50,
  //     y: 50,
  //     width: 100,
  //     height: 100,
  //     fill: "black",
  //     cornerRadius: [0, 10, 20, 30]
  //   })
  //   layer.add(tag)
  //   stage.add(layer)
  //   layer.draw()

  //   assert.equal(tag.cornerRadius()[0], 0)
  //   assert.equal(tag.cornerRadius()[1], 10)
  //   assert.equal(tag.cornerRadius()[2], 20)
  //   assert.equal(tag.cornerRadius()[3], 30)

  //   var trace = layer.getContext().getTrace()
  //   assert.equal(
  //     trace,
  //     "clearRect(0,0,578,200);save();transform(1,0,0,1,50,50);beginPath();moveTo(0,0);lineTo(90,0);arc(90,10,10,4.712,0,false);lineTo(100,80);arc(80,80,20,0,1.571,false);lineTo(30,100);arc(30,70,30,1.571,3.142,false);lineTo(0,0);arc(0,0,0,3.142,4.712,false);closePath();fillStyle=black;fill();restore();clearRect(0,0,578,200);save();transform(1,0,0,1,50,50);beginPath();moveTo(0,0);lineTo(90,0);arc(90,10,10,4.712,0,false);lineTo(100,80);arc(80,80,20,0,1.571,false);lineTo(30,100);arc(30,70,30,1.571,3.142,false);lineTo(0,0);arc(0,0,0,3.142,4.712,false);closePath();fillStyle=black;fill();restore();"
  //   )
  // })

  // test("react to pointer properties", () => {
  //   var stage = new Stage({ autoDraw: false })
  //   var layer = new Layer()
  //   stage.add(layer)

  //   var label = new Label({
  //     x: 100,
  //     y: 100,
  //     draggable: true
  //   })

  //   var counter = 0
  //   var oldSync = label._sync
  //   label._sync = () => {
  //     oldSync.call(label)
  //     counter += 1
  //   }

  //   const tag = new Tag({
  //     fill: "#bbb",
  //     shadowColor: "black",
  //     shadowBlur: 10,
  //     shadowOffset: { x: 10, y: 10 },
  //     shadowOpacity: 0.2,
  //     lineJoin: "round",
  //     pointerDirection: "up",
  //     pointerWidth: 20,
  //     pointerHeight: 20,
  //     cornerRadius: 5
  //   })
  //   // add a tag to the label
  //   label.add(tag)

  //   // add text to the label
  //   label.add(
  //     new Text({
  //       text: "hello",
  //       fontSize: 50,
  //       lineHeight: 1.2,
  //       fill: "green"
  //     })
  //   )
  //   layer.add(label)

  //   assert.equal(counter, 4)
  //   tag.pointerDirection("bottom")
  //   assert.equal(counter, 5)
  //   tag.pointerWidth(30)
  //   assert.equal(counter, 6)
  //   tag.pointerHeight(40)
  //   assert.equal(counter, 7)
  // })
})
