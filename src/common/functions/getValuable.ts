import { Valuable } from "../types";

export function getValuable<T extends {}, V = Valuable<T>>(obj: T): V;
export function getValuable<T extends {}, V = Valuable<T>>(obj: T[]): V[];
export function getValuable<T extends {}, V = Valuable<T>>(
  obj: T | T[]
): V | V[] {
  const filterPredicate = ([, v]: [string, unknown]) =>
    !(
      (typeof v === "string" && !v.length) ||
      v === null ||
      typeof v === "undefined"
    );

  if (Array.isArray(obj)) {
    return obj.map((item) =>
      Object.fromEntries(Object.entries(item).filter(filterPredicate))
    ) as V[];
  } else {
    return Object.fromEntries(Object.entries(obj).filter(filterPredicate)) as V;
  }
}
