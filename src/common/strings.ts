type StringBuilderSpec = Record<string, boolean>;

export function specBasedStringConcat(spec: StringBuilderSpec, sep: string): string {
  return Object.entries(spec)
    .filter(([,v]) => v)
    .map(([k]) => k)
    .join(sep);
}
