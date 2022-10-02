import React from 'react';
import './animation-experiment.scss';
import { updateWithState } from '../animationUpdateRules';
import withAnimatedProps from '../withAnimatedProps';

const rpms = 6 / 60000;
const fullRotation = 2 * Math.PI;

/*
What is animation?
  -> Animation is the change of state over time
  S_T = transition(S_T-duration, duration)

Design decisions:
  Do we want animate using hooks? HoC? Do we need a Context?
 */

type BoxProps = {
  angle: number,
  x: number,
  y: number,
};

function Box({
  angle,
  x,
  y,
}: BoxProps) {
  return <div className="box" style={{ transform: `translate(${x}px, ${y}px) rotate(${angle}rad) ` }} />;
}

const AnimatedBox = withAnimatedProps(
  {
    angle: {
      type: 'linear',
      initial: 0,
      updateRule: (prev, delta) => (prev - delta * rpms * fullRotation) % fullRotation,
    },
    x: {
      type: 'linear',
      initial: 0,
      updateRule: updateWithState(
        0,
        (prev, delta) => (prev + delta * rpms * fullRotation) % fullRotation,
        (state) => Math.cos(state) * 100,
      ),
    },
    y: {
      type: 'linear',
      initial: 0,
      updateRule: updateWithState(
        0,
        (prev, delta) => (prev + delta * rpms * fullRotation) % fullRotation,
        (state) => Math.sin(state) * 100,
      ),
    },
  },
  Box,
);

export function AnimationExperiment1() {
  return (
    <div className="animation-experiment-1">
      <AnimatedBox />
    </div>
  );
}
