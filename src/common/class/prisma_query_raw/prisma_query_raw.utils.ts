const snakeToCamel = (s: string) =>
  s.replace(/(_\w)/g, (k) => k[1].toUpperCase());

export function mapPrismaQueryRawObject<T extends object>(obj: object): T {
  const mappedObject = Object.entries(obj).reduce(
    (x: Record<string, any>, [k, v]: [string, any]) => {
      x[snakeToCamel(k)] = v;
      return x;
    },
    {},
  );

  return mappedObject as T;
}
