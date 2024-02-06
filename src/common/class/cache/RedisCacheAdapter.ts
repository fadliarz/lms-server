import { ICacheWrapper, CacheOptions, StringifyFields } from "./cache.type";
import { createClient } from "redis";

export default class RedisCacheAdapter implements ICacheWrapper {
  private client: ReturnType<typeof createClient>;

  constructor() {
    this.initialiseClientConnection();
  }

  public async hSet<V extends Record<string, string | number>>(
    key: string,
    value: V,
    options?: CacheOptions,
  ): Promise<number> {
    return await this.client.hSet(key, this.serializeObject<V>(value));
  }

  public async hGetAll<V extends Record<string, string | number>>(
    key: string,
    mockObject: V,
  ): Promise<V> {
    const storedObject = (await this.client.hGetAll(key)) as StringifyFields<V>;

    return this.deserializeObject<V>(storedObject, mockObject);
  }

  private serializeObject<
    O extends Record<string, string | number>,
    S = StringifyFields<O>,
  >(obj: O): S {
    const serializedObject: Record<string, string> = {};

    for (const key in obj) {
      const value = obj[key];
      let serializedValue = value as string;
      if (typeof value === "number") {
        serializedValue = value.toString();
      }

      serializedObject[key] = serializedValue;
    }

    return serializedObject as S;
  }

  private deserializeObject<V extends Record<string, string | number>>(
    storedObject: StringifyFields<V>,
    mockObject: V,
  ): V {
    const deserializedObject: Record<string, string | number> = {};

    for (const key in storedObject) {
      const value = storedObject[key];
      let deserializedValue = value as string | number;

      if (typeof mockObject[key] === "number") {
        deserializedValue = Number(value);
      }

      deserializedObject[key] = deserializedValue;
    }

    return deserializedObject as V;
  }

  private async initialiseClientConnection() {
    this.client = await createClient();

    await this.client.connect().then((res) => {
      console.log("Connected to redis!");
    });
  }
}
