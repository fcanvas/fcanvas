import DefaultTheme from "vitepress/theme"
import Preview from "./components/Preview.vue"
import "./style.scss"

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)
    ctx.app.component("Preview", Preview)
  }
}
