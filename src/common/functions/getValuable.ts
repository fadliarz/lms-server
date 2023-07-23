import { Valuable } from "../types";

export function getValuable<T extends {}, V = Valuable<T>>(obj: T): V {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) =>
        !(
          (typeof v === "string" && !v.length) ||
          v === null ||
          typeof v === "undefined"
        )
    )
  ) as V;
}

type Test<T> = T extends null | undefined ? never : T;

type Coeg = Test<null | string>
