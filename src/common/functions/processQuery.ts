type QueryObject<T> = { [key in keyof T]?: string | undefined };

export default function processQuery<T>(query: QueryObject<T>): {
  [key in keyof T]: boolean;
} {
  const result: { [key in keyof T]: boolean } = {} as {
    [key in keyof T]: boolean;
  };

  for (const key in query) {
    if (query.hasOwnProperty(key)) {
      const value = query[key];
      result[key] = value ? /true/i.test(value) : false;
    }
  }

  return result;
}
