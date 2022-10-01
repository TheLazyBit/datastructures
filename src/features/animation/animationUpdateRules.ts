export type PropUpdateRule<Prop> = (state: Prop, deltaMs: number) => Prop;

/**
 * Allows us to animate a different state and derive the prop value from
 * the animated state.
 *
 * @param initial
 * @param updateRule
 * @param propFromState
 */
export function updateWithState<T, S>(
  initial: S,
  updateRule: PropUpdateRule<S>,
  propFromState: (state: S) => T,
): PropUpdateRule<T> {
  let currentState = initial;
  return function closure(state, deltaMs) {
    currentState = updateRule(currentState, deltaMs);
    return propFromState(currentState);
  };
}
