<p align="center">
  <a href="https://fcanvas.js.org" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://fcanvas.js.org/logo.svg" alt="fCanvas logo">
  </a>
</p>

# fcanvas

A powerful 2d canvas library that allows minimal rendering and provides diverse shapes

[![NPM](https://badge.fury.io/js/fcanvas.svg)](http://badge.fury.io/js/fcanvas)
[![Size](https://img.shields.io/bundlephobia/minzip/fcanvas/latest)](https://npmjs.org/package/fcanvas)
[![Languages](https://img.shields.io/github/languages/top/fcanvas/fcanvas)](https://npmjs.org/package/fcanvas)
[![License](https://img.shields.io/npm/l/fcanvas)](https://npmjs.org/package/fcanvas)
[![Download](https://img.shields.io/npm/dm/fcanvas)](https://npmjs.org/package/fcanvas)

## Documention
References: https://fcanvas.js.org

---

## Which dist file to use?

### From CDN or without a Bundler

- **`index.browser(.min).global.js`**:

  - For direct use via `<script src="...">` in the browser. Exposes the `fCanvas` global.
  - Note that global builds are not [UMD](https://github.com/umdjs/umd) builds. They are built as [IIFEs](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) and is only meant for direct use via `<script src="...">`.
  - Leaves prod/dev branches with `window.__DEV__` guards (must be replaced by bundler)
  - Inlines all fCanvas core internal packages - i.e. it's a single file with no dependencies on other files. This means you **must** import everything from this file and this file only to ensure you are getting the same instance of code.
  - Contains hard-coded prod/dev branches, and the prod build is pre-minified. Use the `*.min.global.js` files for production.

- **`index.browser(.min).mjs`**:
  - For usage via native ES modules imports (in browser via `<script type="module">`.
  - Shares the same runtime compilation, dependency inlining and hard-coded prod/dev behavior with the global build.

### With a Bundler

- **`index.mjs`**:

  - For use with bundlers like `webpack`, `rollup` and `parcel`.
  - Leaves prod/dev branches with `process.env.NODE_ENV` guards (must be replaced by bundler)
  - Does not ship minified builds (to be done together with the rest of the code after bundling)
  - Imports dependencies (e.g. `@vue/reactivity`)
    - Imported dependencies are also `esm-bundler` builds and will in turn import their dependencies (e.g. `@vue/reactivity`)
    - This means you **can** install/import these deps individually without ending up with different instances of these dependencies, but you must make sure they all resolve to the same version.

- **`index.js**:
  - Like **`index.mjs`** but use CommonJS
