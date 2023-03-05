<template>
  y89y8989
  <div ref="codeRef">
    <slot />
  </div>
  <iframe v-if="srcdoc" :srcdoc="decodeURIComponent(srcdoc)" />
  <pre>{{ rawCode }}</pre>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue"
import { version } from "../../../package.json"

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
