<template>
  <!-- <div class="vp-code-group">
    <div class="tabs">
      <button :class="{ active: tab === 'code' }" @click="tab = 'code'">Code</button>
      <button :class="{ active: tab === 'prev' }" @click="tab = 'prev'">Preview</button>
    </div>
    <div class="blocks">
      <div ref="codeRef" class="language-" :class="{ active: tab === 'code' }">
        <slot />
      </div>
      <div class="language-" :class="{active: tab === 'prev' }">
        <iframe
          v-if="srcdoc"
          class="preview"
          :srcdoc="decodeURIComponent(srcdoc)"
        />
      </div>
    </div>
  </div> --> <div ref="codeRef" class="language-" :class="{ active: tab === 'code' }">
        <slot />
      </div>
      <iframe
          v-if="srcdoc"
          class="preview"
          :srcdoc="decodeURIComponent(srcdoc)"
        />
</template>

<script lang="ts" setup>
import { ref, computed } from "vue"
import { version } from "../../../package.json"

const tab = ref<"code" | "prev">("code")

const codeRef = ref<HTMLDivElement>()
const rawCode = computed(() => {
  return codeRef.value?.querySelector(".shiki > code")?.textContent
})

const rImportFrom = /(?<=from(?:[\s\t]+)(['"]))([^'"\n]+)(?=\1)/g
const srcdoc = computed<string | void>(() => {
  const raw = rawCode.value

  if (!raw) return

  const ts = raw.replace(rImportFrom, (match) => {
    if (match === "fcanvas") match += `@${version}`
    return `https://esm.run/${match}`
  })

  return `
  <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>*{margin:0;padding:0}</style>
</head>

<body>
  <div id="app"></div>
  %3Cscript type="module">
${ts}
  %3C/script>
%3C/body>
%3C/html>
  `
})
</script>

<style lang="scss" scoped>

button {
  position: relative;
  display: inline-block;
  border-bottom: 1px solid transparent;
  z-index: 1;
  padding: 0 12px;
  line-height: 48px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-code-tab-text-color);
  background-color: var(--vp-code-tab-bg);
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.25s;

  
  &.active {
  color: var(--vp-code-tab-active-text-color);
  border-bottom-color: var(--vp-button-brand-border)
}
&:hover {
  color: var(--vp-code-tab-hover-text-color);
}
}

.preview {
  border: none;
  min-height: 300px;
  width: 100%;
  // display: none;
}

.language-.active :deep(> *) {
  display: block !important;
}
</style>
