export type IgnoreUndefined<T> = {
  [P in keyof T as T[P] extends undefined ? never : P]: T[P]
};

export type RestrictProperties<Obj, Allowed = keyof Obj> = {
  [Key in keyof Obj]: Key extends Allowed ? Obj[Key] : never
};
