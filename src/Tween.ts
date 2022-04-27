import { Easing, getAll, Tween as TweenJS, update } from "@tweenjs/tween.js";
import clonedeep from "lodash.clonedeep";

import { Group } from "./Group";
import { Layer } from "./Layer";
import { createProxy } from "./helpers/createProxy";
import { Label } from "./shapes/Label";
import AllShape from "./types/AllShape";

function assign<T>(obj1: T, obj2: T) {
  // eslint-disable-next-line functional/no-loop-statement
  for (const prop in obj2) {
    if (typeof obj2[prop] === "object" && obj2[prop] !== null) {
      assign(obj1[prop], obj2[prop]);
      continue;
    }
    // eslint-disable-next-line functional/immutable-data
    obj1[prop] = obj2[prop];
  }
}

function startTween() {
  if (getAll().length) {
    update();
    requestAnimationFrame(startTween);
  }
}
export class Tween<
  Node extends AllShape | Group | Label | Layer
> {
  // eslint-disable-next-line functional/prefer-readonly-type
  private tween!: TweenJS<Node["attrs"]>;
  // eslint-disable-next-line functional/prefer-readonly-type
  private attrsStart!: TweenJS<Node["attrs"]>;
  constructor(
    private readonly attrs: {
      // eslint-disable-next-line functional/prefer-readonly-type
      node: Node;
      // eslint-disable-next-line functional/prefer-readonly-type
      attrs: Node["attrs"];
      // eslint-disable-next-line functional/prefer-readonly-type
      duration: number;
      // eslint-disable-next-line functional/prefer-readonly-type
      easing?: (k: number) => number;
      // eslint-disable-next-line functional/prefer-readonly-type
      onUpdate?: () => void;
      // eslint-disable-next-line functional/prefer-readonly-type
      onFinish?: () => void;
    }
  ) {
    this.resetTween();

    this.attrs = createProxy(
      attrs,
      (prop, val) => {
        if (prop === "attrs" || prop === "node") {
          this.resetTween();
        }
        if (prop === "duration") {
          this.tween.duration(val);
          return;
        }
        if (prop === "easing") {
          this.tween.easing(val);
          return;
        }
      },
      ["node", "onUpdate", "onFinish"]
    );
  }
  private resetTween() {
    this.attrsStart = clonedeep(this.attrs.node.attrs);

    this.tween = new TweenJS(this.attrsStart)
      .to(this.attrs.attrs)
      .duration(this.attrs.duration)
      .easing(this.attrs.easing ?? Easing.Linear.None)
      .onUpdate((attrs) => {
        this.attrs.onUpdate?.();
        assign(this.attrs.node.attrs, attrs);
      })
      .onComplete((attrs) => {
        this.attrs.onFinish?.();
        this.attrsStart = clonedeep(attrs);
      });
  }

  public destroy() {
    this.tween.stop();
  }
  public finish() {
    this.tween.end();
  }
  public pause() {
    this.tween.pause();
  }
  public play() {
    if (this.tween.isPaused()) {
      this.tween.start();
      startTween();
    } else {
      this.tween.resume();
    }
  }
  public reset() {
    this.resetTween();
  }
  public seek(time: number) {
    this.tween.update(time);
  }
}
