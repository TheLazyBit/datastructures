import React from 'react';
import './DotsAndLines.scss';
import withAnimatedState from '../withAnimatedProps';

const dotRadius = 2.5;
const maxDistance = 75;
const speed = 0.5 / 1000;
const maxSpeed = 25;

type Vector = {
  x: number,
  y: number,
};

type Dot = {
  x: number,
  y: number,
  vector: Vector
};

type BoundingBox = {
  width: number,
  height: number,
};

type DotsAndLines = {
  boundingBox: BoundingBox
  dots: Dot[]
};

function pairwiseMap<T, R>(array: T[], map: (left: T, right: T) => R): R[] {
  const mapped = [];
  for (let leftIdx = 0; leftIdx < array.length; leftIdx += 1) {
    for (let rightIndex = leftIdx + 1; rightIndex < array.length; rightIndex += 1) {
      mapped.push(map(array[leftIdx]!, array[rightIndex]!));
    }
  }
  return mapped;
}

function DrawDot({
  dot: {
    x,
    y,
  },
}: { dot: Dot }) {
  return <circle cx={x} cy={y} r={dotRadius} fill="white" />;
}

function DrawLine({
  first,
  second,
}: { first: Dot, second: Dot }) {
  const distance = Math.sqrt((first.x - second.x) ** 2 + (first.y - second.y) ** 2);
  const alpha = Math.max(1 - (distance / maxDistance), 0);

  return (
    <line
      x1={first.x}
      y1={first.y}
      x2={second.x}
      y2={second.y}
      stroke={`rgba(255, 255, 255, ${alpha})`}
    />
  );
}

function DrawDotsAndLines({
  dots,
  boundingBox: {
    width,
    height,
  },
}: DotsAndLines) {
  return (
    <svg width={width} height={height}>
      {pairwiseMap(dots, (left, right) => <DrawLine first={left} second={right} />)}
      {dots.map((dot) => <DrawDot dot={dot} />)}
    </svg>
  );
}

function stepDot(dot: Dot, boundingBox: BoundingBox, delta: number): Dot {
  const x = (dot.x + delta * speed * dot.vector.x);
  const y = (dot.y + delta * speed * dot.vector.y);
  let dx = dot.vector.x;
  let dy = dot.vector.y;
  if (x < dotRadius) {
    dx = Math.abs(dx);
  }
  if (y < dotRadius) {
    dy = Math.abs(dy);
  }
  if (x >= boundingBox.width - dotRadius) {
    dx = -Math.abs(dx);
  }
  if (y >= boundingBox.height - dotRadius) {
    dy = -Math.abs(dy);
  }

  return {
    x,
    y,
    vector: {
      x: dx,
      y: dy,
    },
  };
}

export default function DotsAndLines() {
  const boundingBox = {
    width: 256,
    height: 256,
  };
  const dots: Dot[] = new Array(25)
    .fill('')
    .map(() => ({
      x: Math.random() * boundingBox.width,
      y: Math.random() * boundingBox.height,
      vector: {
        x: (Math.random() - 0.5) * 2 * maxSpeed,
        y: (Math.random() - 0.5) * 2 * maxSpeed,
      },
    }));
  const AnimatedDotsAndLines = withAnimatedState(
    { boundingBox, dots },
    (state, deltaMs) => ({ ...state, dots: state.dots.map((dot) => stepDot(dot, boundingBox, deltaMs)) }),
    (state) => state,
    DrawDotsAndLines,
  );

  return (
    <div className="dots-and-lines">
      <AnimatedDotsAndLines />
    </div>
  );
}
