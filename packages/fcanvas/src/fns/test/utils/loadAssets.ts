import { curlFile } from "./curlFile"

export async function loadAssets<T = string>(
  url: string,
  fnLoad: (url: string) => Promise<T>,
  fnParse: (text: string) => T = (t) => t as unknown as T
) {
  const text = await fnLoad(url)
  const sample = fnParse(curlFile(url))

  return {
    text,
    sample
  }
}
