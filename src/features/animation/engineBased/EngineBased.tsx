import React, { useEffect, useState } from 'react';
import { none, some } from 'voided-data/dist/monads/maybe';
import { Animation } from '../../generalAnimation/animationEngine';
import { AnimationWrapper, useAnimationEngine } from './AnimationContext';
import useTouch from '../../../common/hooks/useTouch';

// can now use the engine in HoC if i wanted to
// could use other types of engines, they could have a fixed rate
// based on some other timing mechanism
// and the hoc would run an animation frame loop
// and pass the "animation.state()" along

// This is much simpler, I think.
// Let's assume I want to make a "manually stepped engine"
// or an engine that doesn't use ms but is discrete etc
// I can do all of that, simply by providing a different engine
// but don't have to modify anything else

// for example, let's say the engine does interpolation between client
// and server state, since the render loop can be decoupled from the
// animation state, we just don't care about sync.
// (still a performance issue, since JS is not multi-threaded)

function AnimatedNumber() {
  const engine = useAnimationEngine();
  const [animation] = useState<Animation<number>>(
    engine.create(
      0,
      (state, delta) => (state > 1000 ? none() : some(state + delta)), // test stop condition
    )
  );
  // demo on how to simplify the animation state handling,
  // no need to duplicate all the state across to react
  // essentially the hoc i described above would do it this way
  // just "touch" on animation frame
  // it might even just inject the animation object itself
  // that way we really just call "next frame" on the children
  // which read from their animation
  const touch = useTouch();
  useEffect(
    () => animation.listen(() => touch()),
    [],
  );

  return (
    <div>
      <p>
        running:
        {`${animation.isActive()}`}
        {' '}
        - state:
        {animation
          .state()
          .match(
            (just) => just,
            () => 'N/A',
          )}
      </p>
      <button
        type="button"
        onClick={animation.start}
      >
        Start
      </button>
      <button
        type="button"
        onClick={animation.stop}
      >
        Stop
      </button>
    </div>
  );
}

export function AnimateNumber() {
  return (
    <AnimationWrapper>
      <AnimatedNumber />
    </AnimationWrapper>
  );
}
