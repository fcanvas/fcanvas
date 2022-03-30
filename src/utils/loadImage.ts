import { Utils } from "../Utils";

export function loadImage(url: string): Promise<HTMLImageElement> {
  const img = new Utils.Image();

  return new Promise((resolve, reject) => {
    function done() {
      resolve(img);
      img.removeEventListener("load", done);
      img.removeEventListener("error", fail);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function fail(err: any) {
      reject(err);
      img.removeEventListener("load", done);
      img.removeEventListener("error", fail);
    }

    img.addEventListener("load", done);
    img.addEventListener("error", fail);

    // eslint-disable-next-line functional/immutable-data
    img.src = url;
  });
}
