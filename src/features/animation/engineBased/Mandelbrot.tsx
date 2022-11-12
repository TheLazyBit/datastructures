import React, { useEffect, useRef, useState } from 'react';
import { some } from 'voided-data/dist/monads/maybe';
import { AnimationWrapper, useAnimationEngine } from './AnimationContext';
import { Animation, AnimationEventType } from '../../generalAnimation/animationEngine';

const w = 1024 * 2;

const xMin = -0.750222;
const xMax = -0.749191;
const xRange = xMax - xMin;

const yMin = 0.031161;
const yMax = 0.031752;
const yRange = yMax - yMin;

const h = Math.floor(w * (yRange / xRange));

// eslint-disable-next-line @typescript-eslint/no-shadow
function hslToRgb(h: number, s: number, l: number) {
  // eslint-disable-next-line no-param-reassign
  h %= 1;
  let r;
  let g;
  let b;

  if (s === 0) {
    // eslint-disable-next-line no-multi-assign
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = function hue2rgb(p: number, q: number, t: number) {
      // eslint-disable-next-line no-param-reassign
      if (t < 0) t += 1;
      // eslint-disable-next-line no-param-reassign
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

type MandelPoint = {
  center: {
    x: number,
    y: number,
  }
  path: {
    x: number,
    y: number,
  }
  diverged: {
    iter: number
    inside: boolean
  },
};

const getColorIndicesForCoord = (x: number, y: number, width: number): number => y * (width * 4) + x * 4;

const paletteSize = 255 * 4;
const palette = new Array(paletteSize)
  .fill(null)
  .map((_, idx) => hslToRgb(idx / paletteSize + 0.5, 1, 0.5)) as [number, number, number][];

function Mandelbrot() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const engine = useAnimationEngine();
  const [started, start] = useState(false);
  const [anim, setAnim] = useState<Animation<number> | null>(null);

  useEffect(() => {
    start(true);
    setAnim(
      engine.create(
        25,
        (state, delta) => some(state + (delta) / (16.7))
      )
    );
  }, []);

  function mandelStep(point: MandelPoint): void {
    if (!point.diverged.inside) return;
    const { x, y } = point.path;
    const x2 = x * x;
    const y2 = y * y;
    const xtemp = x2 - y2 + point.center.x;

    const inside = x2 + y2 <= 4;

    // eslint-disable-next-line no-param-reassign
    point.path.x = xtemp;
    // eslint-disable-next-line no-param-reassign
    point.path.y = 2 * x * y + point.center.y;
    // eslint-disable-next-line no-param-reassign
    point.diverged.iter = inside ? point.diverged.iter + 1 : point.diverged.iter;
    // eslint-disable-next-line no-param-reassign
    point.diverged.inside = inside;
  }

  useEffect(() => {
    if (started) {
      const ctx = ref.current!!.getContext('2d', { alpha: false })!!;
      const data = ctx.createImageData(w, h);
      for (let i = 0; i < data.data.length; i += 1) {
        data.data[i] = 255;
      }
      let cIter = 0;
      const points = new Array(w)
        .fill(null)
        .flatMap(
          (_, x) => new Array(h)
            .fill(null)
            .map((__, y) =>
              ({
                pos: {
                  x,
                  y,
                },
                center: {
                  x: (x / w) * xRange + xMin,
                  y: (y / h) * yRange + yMin,
                },
                path: {
                  x: 0,
                  y: 0,
                },
                diverged: {
                  iter: 0,
                  inside: true,
                },
              }))
        );
      const unsub = anim!!.listen((e) => {
        if (e.type === AnimationEventType.UPDATE) {
          if (Math.floor(e.newState) > cIter) {
            // eslint-disable-next-line no-restricted-syntax
            // while (Math.floor(e.newState) > cIter) {
            cIter += 1;
            // eslint-disable-next-line no-restricted-syntax
            for (const p of points) {
              if (p.diverged.inside) {
                mandelStep(p);
              }
              // }
            }
            //
            // eslint-disable-next-line no-restricted-syntax
            for (const p of points) {
              if (!p.diverged.inside) {
                const [cr, cg, cb] = palette[p.diverged.iter % palette.length]!!;
                const r = getColorIndicesForCoord(p.pos.x, p.pos.y, w);
                data.data[r] = cr;
                data.data[r + 1] = cg;
                data.data[r + 2] = cb;
              }
            }
            ctx.putImageData(data, 0, 0);
            ctx.fillStyle = 'red';
            ctx.fillText(`iterations = ${cIter}`, 2, 10);
          }
        }
      });
      anim!!.start();
      return unsub;
    }
    return () => {};
  }, [started]);

  return <canvas ref={ref} width={w} height={h} style={{ border: '4px solid black' }} />;
}

export default function MBW() {
  return (
    <AnimationWrapper>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}
      >
        <Mandelbrot />
      </div>
    </AnimationWrapper>
  );
}
