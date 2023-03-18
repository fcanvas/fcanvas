# fcanvas

A powerful 2d canvas library that allows minimal rendering and provides diverse shapes
[https://fcanvas.js.org](https://fcanvas.js.org)

> Close the path when you're done drawing, not fill

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/41759ee192f8452db91f2ef346faaac5)](https://app.codacy.com/gh/fcanvas/fcanvas?utm_source=github.com&utm_medium=referral&utm_content=fcanvas/fcanvas&utm_campaign=Badge_Grade)
[![GitHub license](https://img.shields.io/github/license/fcanvas/fcanvas)](https://github.com/fcanvas/fcanvas/blob/main/LICENSE) <img alt="GitHub Issues" src="https://img.shields.io/github/issues/fcanvas/fcanvas" /> <img alt="Code Score" src="https://api.codiga.io/project/35319/score/svg" /> <img alt="Code Score" src="https://api.codiga.io/project/35319/status/svg" />

[![Test](https://github.com/fcanvas/fcanvas/actions/workflows/test.yml/badge.svg)](https://github.com/fcanvas/fcanvas/actions/workflows/test.yml)
[![CodeQL](https://github.com/fcanvas/fcanvas/actions/workflows/codeql.yml/badge.svg)](https://github.com/fcanvas/fcanvas/actions/workflows/codeql.yml)
[![ESLint](https://github.com/fcanvas/fcanvas/actions/workflows/eslint.yml/badge.svg)](https://github.com/fcanvas/fcanvas/actions/workflows/eslint.yml)
[![Prettier](https://github.com/fcanvas/fcanvas/actions/workflows/prettier.yml/badge.svg)](https://github.com/fcanvas/fcanvas/actions/workflows/pretter.yml)
[![TypeScript Checker Declaration](https://github.com/fcanvas/fcanvas/actions/workflows/typing.yml/badge.svg)](https://github.com/fcanvas/fcanvas/actions/workflows/typing.yml)
[![Try build](https://github.com/fcanvas/fcanvas/actions/workflows/try-build.yml/badge.svg)](https://github.com/fcanvas/fcanvas/actions/workflows/try-build.yml)


[![NPM](https://badge.fury.io/js/fcanvas.svg)](http://badge.fury.io/js/fcanvas)
[![Size](https://img.shields.io/bundlephobia/minzip/fcanvas/latest)](https://npmjs.org/package/fcanvas)
[![Languages](https://img.shields.io/github/languages/top/fcanvas/fcanvas)](https://npmjs.org/package/fcanvas)
[![License](https://img.shields.io/npm/l/fcanvas)](https://npmjs.org/package/fcanvas)
[![Star](https://img.shields.io/github/stars/fcanvas/fcanvas)](https://github.com/fcanvas/fcanvas/stargazers)
[![Download](https://img.shields.io/npm/dm/fcanvas)](https://npmjs.org/package/fcanvas)

## Packages
| Name | Description |
| ---- | ----------- |
| [fcanvas](./packages/fcanvas/) | The main package provides classes and methods for drawing canvas and manipulating events |
| [@fcanvas/animate](./packages/animate/) | plugin that allows connecting `gsap` to `fcanvas` to create powerful animations |
| [@fcanvas/communicate](./packages/communicate/) | This package allows a simple connection between MessageChannel-based channels such as `WebWorker`, `IFrame`... |
| [@fcanvas/node](./packages/node/) | Plugin allow use fcanvas in NodeJS |
| [@fcanvas/tile](./packages/tile/) | Plugin that allows creating tiles from file |
| [@fcanvas/worker](./packages/worker) | The plugin provides support for using fCanvas in WebWorker | 

## Installation

NPM / Yarn / Pnpm:

```bash
pnpm add fcanvas
```

CDN:

```html
<script src="https://unpkg.com/fcanvas"></script>
```

## Example

```ts
import { Stage, Layer, Circle } from "fcanvas"
import { installAnimate } from "@fcanvas/animate"

installAnimate(Shape)

const stage = new Stage({
  container: "app",
  width: 300,
  height: 300
})

const layer = new Layer()
stage.add(layer)

const circle = new Circle({
  x: 0,
  y: 0,
  radius: 20,
  fill: "red"
})

layer.add(circle)

circle.to({
    x: stage.$.width,
    duration: 1
})
```

> If you don't like using [@fcanvas/animate](https://npmjs.com/package/@fcanvas/animate) you can always use [gsap](https://npmjs.com/package/gsap) by:


```ts
import gsap from "gsap"
...

gsap(circle.$).to({
    x: stage.$.width,
    duration: 1
})
```

## Demos

- Clock: https://codesandbox.io/s/clock-fcanvas-next-kti3b4
