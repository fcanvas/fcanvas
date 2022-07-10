export function normalize(n: number, min: number, max: number) {
  while (n < min) n += max - min
  while (n >= max) n -= max - min
  return n
}
