// Animation
// Finite <-> Infinite
// Looping?
// Transitions between animations?
// sequencing? parallel?
// What is an animation? How do I want to model it?
//    Generically -> It's a transition of some state over time.
//    -> I need a "state" and a "transition" and "time"
// finite means transition needs to "trigger events"?
//    or some other method of detecting the final state?
//    null? some wrapper?
//    access to the start and or stop functions? <- feels somewhat dirty, maybe just stop and restart (for looping)?
//      I could argue that "stopping" is a transition, but it'd feel better to encode it as a return...
//        Let's just use the Maybe for this
import { Maybe, none, some } from 'voided-data/dist/monads/maybe';

export type AnimationTick = number;
/**
 * DO NOT MODIFY INPUT STATE
 * return a new state, this should be immutable
 * do not cause side effects
 */
export type AnimationTransition<T> = (state: T, delta: AnimationTick) => Maybe<T>;
type AnimationSpecification<T> = {
  id: number,
  state: Maybe<T>
  transition: AnimationTransition<T>
};

export enum AnimationEventType {
  START,
  STOP,
  UPDATE,
}

type AnimationStartEvent = {
  type: AnimationEventType.START
};
type AnimationStopEvent = {
  type: AnimationEventType.STOP
};
type AnimationUpdateEvent<T> = {
  type: AnimationEventType.UPDATE
  newState: T
};

export type AnimationEvent<T> = AnimationStartEvent
| AnimationStopEvent
| AnimationUpdateEvent<T>;

export type AnimationEventListener<T> = (event: AnimationEvent<T>) => unknown;
export interface Animation<T> {
  start(): void
  stop(): void
  /**
   * @param listener
   * @return function to remove the event listener
   */
  listen(
    listener: AnimationEventListener<T>
  ): () => void
  // returns a none when the animation is not running!
  // watch my DSA&TS series "Maybe" video if this confuses you
  state(): Maybe<T>
  isActive(): boolean
}
export interface AnimationEngine {
  create: <T>(
    initialState: T,
    transition: AnimationTransition<T>,
  ) => Animation<T>
  // destroys the engine
  destroy: () => void
}

export function createBrowserEngine(): AnimationEngine {
  // we need to find specs across mapped data, object ids are not usable => assign internal ids
  let animationSpecId = 0;

  let animations: AnimationSpecification<unknown>[] = [];

  let before: DOMHighResTimeStamp | undefined;

  let handle: number;
  function loop(now: DOMHighResTimeStamp) {
    if (before !== undefined) {
      const delta = now - before;
      const newAnimations: AnimationSpecification<unknown>[] = [];
      animations.forEach((anim) => { // need to filter this, duh...
        anim.state
          .map((s) => anim.transition(s, delta))
          .match(
            (just) => newAnimations.push({
              ...anim,
              state: just
            }),
            () => {}
          );
      });
      animations = newAnimations;
    }
    before = now;
    handle = requestAnimationFrame(loop);
  }
  handle = requestAnimationFrame(loop);

  return {
    // need to think how to handle / specify various different types of animation
    create: <T> (
      initialState: T,
      transition: AnimationTransition<T>
    ) => {
      // SETUP internal id to persist across update cycles
      const specId = animationSpecId;
      animationSpecId += 1;

      const listeners: AnimationEventListener<T>[] = [];

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const index = () => animations.findIndex(({ id }) => animSpec.id === id);

      function stop() {
        const idx = index();
        if (idx !== -1) {
          animations.splice(
            idx,
            1,
          );
          listeners.forEach((listener) => listener({
            type: AnimationEventType.STOP
          }));
        }
      }

      const animSpec = {
        id: specId,
        state: some(initialState),
        transition: (state, delta) => {
          const newState = transition(state, delta);
          listeners.forEach(
            (listener) => listener(
              newState.match(
                (just) => ({ type: AnimationEventType.UPDATE, newState: just, }),
                () => ({ type: AnimationEventType.STOP }),
              ),
            ),
          );
          return newState;
        },
      } as AnimationSpecification<T>;

      const state = (): Maybe<T> => {
        const idx = index();
        if (idx === -1) return none();
        return animations[idx]!!.state as Maybe<T>;
      };

      return {
        start() {
          if (index() === -1) {
            animations.push(animSpec as AnimationSpecification<unknown>);
            listeners.forEach((listener) => listener({
              type: AnimationEventType.START
            }));
          }
        },
        stop,
        isActive(): boolean {
          // much better to handle over the state, since that is the deciding factor anyway
          return state().match(
            () => true,
            () => false,
          );
        },
        state,
        listen(
          listener: AnimationEventListener<T>
        ): () => void {
          // This allows someone to register the same function
          // multiple times if they wanted to,
          // while our "remove" will still remove the correctly
          // matched function (does not really matter in this instance
          // since they are identical functions and call order should be independent
          // but still just wanted to show this off I guess)
          const wrapped: AnimationEventListener<T> = (e) => listener(e);
          listeners.push(wrapped);
          let wasRemoved = false;
          return () => {
            if (wasRemoved) return;
            listeners.splice(listeners.indexOf(wrapped), 1);
            wasRemoved = true;
          };
        }
      };
    },
    destroy: () => {
      cancelAnimationFrame(handle);
    }
  };
}
