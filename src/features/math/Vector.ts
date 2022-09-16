export type Scalar = number;
export type Vector = { x: Scalar, y: Scalar };

export const len = (v: Vector): Scalar => Math.sqrt(v.x ** 2 + v.y ** 2);

export const normalize = (v: Vector): Vector => (
  (length) => ({ x: v.x / length, y: v.y / length })
)(
  len(v),
);

function add(first: Vector, second: Vector): Vector;
function add(first: Vector, second: Scalar): Vector;
function add(first: Vector, second: Vector | Scalar): Vector {
  const other = typeof second === 'number'
    ? ({ x: second, y: second })
    : second;
  return {
    x: first.x + other.x,
    y: first.y + other.y,
  };
}

function sub(first: Vector, second: Vector): Vector;
function sub(first: Vector, second: Scalar): Vector;
function sub(first: Vector, second: Vector | Scalar): Vector {
  const other = typeof second === 'number'
    ? ({ x: second, y: second })
    : second;
  return {
    x: first.x - other.x,
    y: first.y - other.y,
  };
}

export const mult = ({ x, y }: Vector, second: Scalar): Vector => ({ x: x * second, y: y * second });

export const div = ({ x, y }: Vector, second: Scalar): Vector => ({ x: x / second, y: y / second });

export const Vector = {
  len,
  normalize,
  add,
  sub,
  mult,
  div,
};
