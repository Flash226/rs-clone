export function isFlavorsType(value: unknown) {
  return (
    value instanceof Array &&
    value.every((elem) => {
      return elem.brand && elem.name && elem.description && elem.image && elem.strength && elem.flavor && elem.id;
    })
  );
}
