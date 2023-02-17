import { execSync } from "child_process"

export function curlFile(url: string): string {
  return execSync(`curl "${url}"`).toString()
}
