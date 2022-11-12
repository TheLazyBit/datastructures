import React, {
  ReactElement, useEffect, useRef, useState
} from 'react';
import Center from '../../common/components/Center';

enum Direction {
  North,
  South,
  East,
  West,
}

type Cell = {
  x: number,
  y: number,
  doors: Direction[],
};

type Maze = {
  height: number,
  width: number,
  cells: Cell[],
};

const CELLS_COLOR = '#c1c1c1';
const WALL_COLOR = '#3e3e3e';

function idx(w: number, x: number, y: number): number {
  return w * y + x;
}

function drawMaze(canvas: HTMLCanvasElement, maze: Maze) {
  const { height: canvasHeight, width: canvasWidth } = canvas;
  const canvasSmallSide = Math.min(canvasWidth, canvasHeight);
  const mazeLargeSide = Math.max(maze.width, maze.height);
  const cellSize = Math.floor(canvasSmallSide / mazeLargeSide);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = CELLS_COLOR;
  for (let x = 0; x < maze.width; x += 1) {
    for (let y = 0; y < maze.width; y += 1) {
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
  ctx.fillStyle = WALL_COLOR;
  for (let x = 0; x < maze.width; x += 1) {
    for (let y = 0; y < maze.width; y += 1) {
      const i = idx(maze.width, x, y);
      const cell = maze.cells[i]!;
      if (!cell.doors.includes(Direction.North)) {
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, 1);
      }
      if (!cell.doors.includes(Direction.South)) {
        ctx.fillRect(x * cellSize, (y + 1) * cellSize - 1, cellSize, 1);
      }
      if (!cell.doors.includes(Direction.West)) {
        ctx.fillRect(x * cellSize, y * cellSize, 1, cellSize);
      }
      if (!cell.doors.includes(Direction.East)) {
        ctx.fillRect((x + 1) * cellSize - 1, y * cellSize, 1, cellSize);
      }
    }
  }
}

type FC<T> = (props: T, context?: any) => ReactElement;

const asSecondPassComponent = <T extends {},>(Comp: FC<T & { firstPass: boolean }>): FC<T> => {
  function Wrapped(props: T): ReactElement {
    const [isFirstPass, setFirstPass] = useState(true);
    useEffect(() => {
      if (isFirstPass) setFirstPass(false);
    }, [isFirstPass]);
    return <Comp {...props} firstPass={isFirstPass} />;
  }
  return Wrapped;
};

export default asSecondPassComponent(({ firstPass }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!firstPass) {
      drawMaze(canvasRef.current!!, {
        height: 2,
        width: 2,
        cells: [
          { x: 0, y: 0, doors: [Direction.South, Direction.East] },
          { x: 0, y: 1, doors: [Direction.West] },
          { x: 1, y: 0, doors: [Direction.North, Direction.East] },
          { x: 1, y: 1, doors: [Direction.West] },
        ]
      });
    }
  }, [firstPass]);

  return (
    <Center>
      <canvas ref={canvasRef} height={1000} width={1000} />
    </Center>
  );
});
