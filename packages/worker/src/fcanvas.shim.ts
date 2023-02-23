import "fcanvas"

declare module "fcanvas" {
  export class Stage {
    public portToWorker(): void;
  }
}
