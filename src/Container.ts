export class Container<
  T extends {
    // eslint-disable-next-line functional/prefer-readonly-type
    matches: (selector: string) => boolean;
  }
> {
  readonly type: string = "Container";
  private readonly _name: string = "";
  public get name(): string {
    return this._name;
  }
  private readonly _id?: string | undefined;
  public get id(): string | undefined {
    return this._id;
  }
  public readonly children = new Set<T>();

  // eslint-disable-next-line functional/functional-parameters
  public add(...nodes: readonly T[]): void {
    nodes.forEach((node) => this.children.add(node));
  }

  public matches(selector: string): boolean {
    return selector.split(",").some((sel) => {
      const [other, id] = sel.trim().split("#");

      const [tag, ...classes] = other.split(".");

      const validTag =
        tag === "" || tag?.toLowerCase() === this.type?.toLowerCase();
      const validClass =
        classes.length === 0
          ? true
          : classes.every((clazz) =>
              new RegExp(`(^| )${clazz}( |$)`).test(this.name)
            );
      const validId = id ? id === this.id : true;

      return validTag && validClass && validId;
    });
  }

  public findAll(selector: string) {
    const nodes = new Set<T>();

    this.children.forEach((node) => {
      if (node.matches(selector)) {
        nodes.add(node);
      }
    });

    return Array.from(nodes.values());
  }
}
