import React from 'react';
import './animation-experiment.scss';

type BoxProps = {
  angle: number,
};
function Box({
  angle,
}: BoxProps) {
  return <div className="box" style={{ transform: `rotate(${angle}rad)` }} />;
}

export function AnimationExperiment() {
  return (
    <div className="animation-experiment-1">
      <Box angle={0} />
    </div>
  );
}
