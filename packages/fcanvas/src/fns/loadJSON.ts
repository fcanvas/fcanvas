import normalize from "path-normalize"

// cache
const fetchJSONMap = new Map<string, string>()
function loadJSON(url: string, get?: true): Promise<string>
// eslint-disable-next-line no-redeclare
function loadJSON(url: string, get: false): string

// eslint-disable-next-line no-redeclare
function loadJSON(url: string, get = false): Promise<string> | string {
  if (get) return getJSON(url)

  const key = normalize(url)
  const inCache = fetchJSONMap.get(key)

  if (inCache) return Promise.resolve(inCache)

  return fetch(url)
    .then((res) => res.json())
    .then((text) => {
      fetchJSONMap.set(key, text)

      return text
    })
}

export { loadJSON }
export function getJSON(url: string): string {
  if (!fetchJSONMap.has(normalize(url)))
    // eslint-disable-next-line functional/no-throw-statement
    throw new Error(`Cannot find image ${url}. First run await loadJSON().`)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return fetchJSONMap.get(normalize(url))!
}
