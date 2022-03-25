export function matchesSelector(
  selector: string,
  element: {
    // eslint-disable-next-line functional/prefer-readonly-type
    type: string;
    // eslint-disable-next-line functional/prefer-readonly-type
    name: string;
    // eslint-disable-next-line functional/prefer-readonly-type
    id: string;
  }
): boolean {
  return selector.split(",").some((sel) => {
    const [other, id] = sel.trim().split("#");

    const [tag, ...classes] = other.split(".");

    const validTag =
      tag === "" || tag?.toLowerCase() === element.type?.toLowerCase();
    const validClass =
      classes.length === 0
        ? true
        : classes.every((clazz) =>
            new RegExp(`(^| )${clazz}( |$)`).test(element.name)
          );
    const validId = id ? id === element.id : true;

    return validTag && validClass && validId;
  });
}
