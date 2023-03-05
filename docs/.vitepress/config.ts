import { DefaultTheme, defineConfig } from "vitepress"
import { version } from "../../package.json"
import mdItContainer from "markdown-it-container"

export default defineConfig({
  lang: "en-US",
  title: "fcanvas",
  description:
    "A next version library fcanvas, Its syntax looks like Konva.js but it uses ES6's Proxy response system and minimizes redrawing.",

  lastUpdated: true,
  cleanUrls: true,

  head: [["meta", { name: "theme-color", content: "#3c8772" }]],

  markdown: {
    headers: {
      level: [0, 0]
    },
    config(md) {
      md.use(mdItContainer, "preview", {
        validate(params) {
          return params.trim().match(/^preview$/)
        },

        render(tokens, idx) {
          var m = tokens[idx].info.trim().match(/^preview$/)

          if (tokens[idx].nesting === 1) {
            // opening tag
            return `<Preview>`
          } else {
            // closing tag
            return "</Preview>"
          }
        }
      })
    }
  },

  themeConfig: {
    nav: nav(),

    sidebar: {
      "/guide/": sidebarGuide()
      // "/config/": sidebarConfig(),
      // "/api/": sidebarGuide()
    },

    editLink: {
      pattern:
        "https://github.com/tachibana-shin/fcanvas-next/edit/main/docs/:path",
      text: "Edit this page on GitHub"
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/tachibana-shin/fcanvas-next" }
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2019-present Tachibana Shin"
    }
  }
})

function nav() {
  return [
    // { text: "Guide", link: "/guide/introduction", activeMatch: "/guide/" },
    {
      text: "Shapes",
      activeMatch: "/guide/shapes/",
      items: shapeItems()
    },
    {
      text: "Functions",
      activeMatch: "/guide/functions/",
      items: functionItems()
    },
    {
      text: "Plugins",
      activeMatch: "/guide/plugins",
      items: pluginItems()
    },
    {
      text: version,
      items: [
        {
          text: "Changelog",
          link: "https://github.com/tachibana-shin/fcanvas-next/blob/main/CHANGELOG.md"
        },
        {
          text: "Contributing",
          link: "https://github.com/tachibana-shin/fcanvas-next/blob/main/.github/contributing.md"
        }
      ]
    }
  ]
}

function shapeItems() {
  return [
    { text: "Arc", link: "/guide/shapes/Arc" },
    { text: "Arrow", link: "/guide/shapes/Arrow" },
    { text: "Circle", link: "/guide/shapes/Circle" },
    { text: "Custom", link: "/guide/shapes/Custom" },
    { text: "Ellipse", link: "/guide/shapes/Ellipse" },
    { text: "Image", link: "/guide/shapes/Image" },
    { text: "ImageRepeat", link: "/guide/shapes/ImageRepeat" },
    { text: "Label", link: "/guide/shapes/Label" },
    { text: "Line-Blob", link: "/guide/shapes/Line-Blob" },
    { text: "Line-Polygon", link: "/guide/shapes/Line-Polygon" },
    { text: "Line-Spline", link: "/guide/shapes/Line-Spline" },
    { text: "Line", link: "/guide/shapes/Line" },
    { text: "Path", link: "/guide/shapes/Path" },
    { text: "Rect", link: "/guide/shapes/Rect" },
    { text: "RegularPolygon", link: "/guide/shapes/RegularPolygon" },
    { text: "Ring", link: "/guide/shapes/Ring" },
    { text: "Sprite", link: "/guide/shapes/Sprite" },
    { text: "Star", link: "/guide/shapes/Star" },
    { text: "Tag", link: "/guide/shapes/Tag" },
    { text: "Text", link: "/guide/shapes/Text" },
    { text: "TextPath", link: "/guide/shapes/TextPath" },
    { text: "Wedge", link: "/guide/shapes/Wedge" }
  ]
}
function pluginItems() {
  return [
    { text: "@fcanvas/animate", link: "/guide/plugins/animate" },
    { text: "@fcanvas/communicate", link: "/guide/plugins/communicate" },
    { text: "@fcanvas/node", link: "/guide/plugins/node" },
    { text: "@fcanvas/tile", link: "/guide/plugins/tile" },
    { text: "@fcanvas/worker", link: "/guide/plugins/worker" }
  ]
}
function functionItems() {
  return [
    {
      text: "Reactivity Watch API",
      link: "/guide/functions/reactivity-watch-api"
    },
    { text: "Other Utils", link: "/guide/functions/other-utils" }
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "Introduction",
      collapsed: false,
      items: [
        { text: "What is fCanvas?", link: "/guide/introduction" },
        { text: "Overview", link: "/guide/overview" }
      ]
    },
    {
      text: "Essentials",
      collapsed: false,
      items: [
        {
          text: "Reactivity Fundamentials",
          link: "/guide/essentials/reactivity-fundamentals"
        },
        { text: "Computed", link: "/guide/essentials/computed" },
        { text: "Watchers", link: "/guide/essentials/watchers" },
        { text: "Events", link: "/guide/essentials/events" },
        { text: "Stage", link: "/guide/essentials/Stage" },
        { text: "Layer", link: "/guide/essentials/Layer" },
        { text: "Group", link: "/guide/essentials/Group" },
        { text: "Shape", link: "/guide/essentials/Shape" }
      ]
    },
    {
      text: "Shapes",
      collapsed: false,
      items: shapeItems()
    },
    {
      text: "Styling",
      collapsed: false,
      items: [
        { text: "Fill", link: "/guide/styling/Fill" },
        {
          text: "Filter",
          link: "/guide/styling/filter"
        },
        {
          text: "Transform",
          link: "/guide/styling/transform"
        }
      ]
    },
    {
      text: "Functions",
      collapsed: false,
      items: functionItems()
    },
    {
      text: "Reusability",
      collapsed: false,
      items: [{ text: "Composables", link: "/guide/reusability/composables" }]
    },
    {
      text: "Plugins",
      collapsed: false,
      items: pluginItems()
    },
    {
      text: "Extra Topics",
      collapsed: false,
      items: [{ text: "Performance", link: "/guide/extra-topics/performance" }]
    }
  ]
}

// function sidebarConfig() {
//   return [
//     {
//       text: "Config Reference",
//       items: [
//         { text: "Introduction", link: "/config/introduction" },
//         { text: "App Config", link: "/config/app-config" },
//         { text: "Default Theme Config", link: "/config/theme-config" },
//         { text: "Frontmatter Config", link: "/config/frontmatter-config" }
//       ]
//     }
//   ]
// }
