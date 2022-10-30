// Animation
// Finite <-> Infinite
// Looping?
// Transitions between animations?
// sequencing? parallel?
// What is an animation? How do I want to model it?
//    Generically -> It's a transition of some state over time.
//    -> I need a "state" and a "transition" and "time"
import { Maybe, none, some } from 'voided-data/dist/monads/maybe';

export type AnimationTick = number;
export type AnimationTransition<T> = (state: T, delta: AnimationTick) => T;
type AnimationSpecification<T> = { // immutable? Yes? cause reading can be an issue
  id: number,
  state: T
  transition: AnimationTransition<T>
};

export enum AnimationEventType {
  START,
  STOP,
  UPDATE,
  LOOP, // todo: think about this
}

type AnimationStartEvent = {
  type: AnimationEventType.START
};
type AnimationStopEvent = {
  type: AnimationEventType.STOP
};
type AnimationLoopEvent = {
  type: AnimationEventType.LOOP
};
type AnimationUpdateEvent<T> = {
  type: AnimationEventType.UPDATE
  newState: T
};

export type AnimationEvent<T> = AnimationStartEvent
| AnimationStopEvent
| AnimationLoopEvent
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

  let animations: AnimationSpecification<any>[] = [];

  let before: DOMHighResTimeStamp | undefined;

  let handle: number;
  function loop(now: DOMHighResTimeStamp) {
    if (before !== undefined) {
      const delta = now - before;
      animations = animations.map((anim) => ({
        id: anim.id,
        state: anim.transition(anim.state, delta),
        transition: anim.transition,
      }));
    }
    before = now;
    handle = requestAnimationFrame(loop);
  }
  handle = requestAnimationFrame(loop);

  return <AnimationEngine>{
    // need to think how to handle / specify various different types of animation
    create: <T> (
      initialState: T,
      transition: AnimationTransition<T>
    ) => {
      // SETUP internal id to persist across update cycles
      const specId = animationSpecId;
      animationSpecId += 1;

      const listeners: AnimationEventListener<T>[] = [];

      const animSpec = {
        id: specId,
        state: initialState,
        transition: (state, delta) => {
          const newState = transition(state, delta);
          listeners.forEach((listener) => listener({
            type: AnimationEventType.UPDATE,
            newState,
          }));
          return newState;
        },
      } as AnimationSpecification<T>;

      const index = () => animations.findIndex(({ id }) => animSpec.id === id);

      return {
        start() {
          if (index() === -1) {
            animations.push(animSpec);
            listeners.forEach((listener) => listener({
              type: AnimationEventType.START
            }));
          }
        },
        stop() {
          if (index() !== -1) {
            animations.splice(
              animations.indexOf(animSpec),
              1,
            );
            listeners.forEach((listener) => listener({
              type: AnimationEventType.STOP
            }));
          }
        },
        isActive(): boolean {
          return index() !== -1;
        },
        state(): Maybe<T> {
          const idx = index();
          if (idx === -1) return none();
          return some(animations[idx]!!.state);
        },
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
