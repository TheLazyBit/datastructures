export function recordWithDefault<K extends string | number | symbol, V>(record: Record<K, V>, defaultValue: (key: K) => V): Record<K, V> {
  return new Proxy(record, {
    get(target: Record<K, V>, key: string | symbol): V {
      if (!Object.hasOwn(target, key)) return defaultValue(key as K);
      return target[key as K];
    },
  });
}
