# @fcanvas/animate

Plugin that provides the ability to use animation for fcanvas

View source code at: https://github.com/fcanvas/fcanvas

[![NPM](https://badge.fury.io/js/@fcanvas%2Fanimate.svg)](http://badge.fury.io/js/@fcanvas%2Fanimate)
[![Size](https://img.shields.io/bundlephobia/minzip/@fcanvas/animate/latest)](https://npmjs.org/package/@fcanvas/animate)
[![Download](https://img.shields.io/npm/dm/@fcanvas/animate)](https://npmjs.org/package/@fcanvas/animate)

### Install
```bash
pnpm add fcanvas @fcanvas/animate gsap
```

### Usage
```ts
import { Stage } from "fcanvas"
import { installAnimate } from "@fcanvas/animate"

installAnimate(Stage)
```

and now the `Animate` class is ready to import and the `.to()` method is up and running
