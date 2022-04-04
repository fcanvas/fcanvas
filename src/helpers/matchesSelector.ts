export function matchesSelector(
  selector: string,
  $type: string,
  $name: string,
  $id: string | null
): boolean {
  return selector.split(",").some((sel) => {
    const [other, id] = sel.trim().split("#");

    const [tag, ...classes] = other.split(".");

    const validTag = tag === "" || tag?.toLowerCase() === $type?.toLowerCase();
    const validClass =
      classes.length === 0
        ? true
        : classes.every((clazz) =>
            new RegExp(`(^| )${clazz}( |$)`).test($name)
          );
    const validId = id ? id === $id : true;

    return validTag && validClass && validId;
  });
}
