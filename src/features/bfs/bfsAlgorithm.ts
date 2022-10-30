import { Graph, Node } from '../../math/Graph';

type NodeMarker = 'unexplored' | 'done' | 'queued';

type NestedPath<T> = { from: Path<T>, node: Node<T> };
export type Path<T> = Node<T> | NestedPath<T> | null;
export function isNestedPath<T>(path: Path<T>): path is NestedPath<T> {
  return !!(path && (path as { node: any }).node);
}
export function isLeafPath<T>(path: Path<T>): path is Node<T> {
  return !!(path && !isNestedPath(path));
}

function getNeighbors<T>(graph: Graph<T>, node: Node<T>): Node<T>[] {
  return graph.edges
    .filter(({ from }) => node.id === from)
    .map(({ to: id }) => graph.nodes.find((n) => n.id === id)!);
}

export type BFSAnnotations<T> = {
  [id: number]: {
    path: Path<T>,
    marking: NodeMarker
  } | undefined
};

export type BFSState<T> = {
  current: Node<T> | null,
  queue: Node<T>[],
  found: Node<T> | null,
  annotations: BFSAnnotations<T>,
};

function markDone<T>(
  annotations: BFSAnnotations<T>,
  current: Node<T>,
): BFSAnnotations<T> {
  return {
    ...annotations,
    [current.id]: {
      ...annotations[current.id]!,
      marking: 'done',
    },
  };
}

function markQueued<T>(
  annotations: BFSAnnotations<T>,
  n: Node<T>,
  current: Node<T>,
): BFSAnnotations<T> {
  return {
    ...annotations,
    [n.id]: {
      path: {
        from: annotations[current.id]?.path!,
        node: n,
      },
      marking: 'queued',
    },
  };
}

export function bfs<T>(
  graph: Graph<T>,
  start: (node: Node<T>) => boolean,
  end: (node: Node<T>) => boolean,
): [Node<T> | null, BFSState<T>[]] {
  const starts = graph.nodes.filter((n) => start(n));
  let annotations: BFSAnnotations<T> = Object.fromEntries(
    starts.map((node) => [node.id, { path: node, marking: 'queued' }]),
  );
  const queue: Node<T>[] = [
    ...starts,
  ];
  const history: BFSState<T>[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    annotations = markDone(annotations, current);

    history.push({
      current, annotations, queue: [...queue], found: null,
    });

    if (end(current)) {
      return [
        current,
        [...history, { ...history[history.length - 1]!, current, found: current }],
      ];
    }

    const neighbors = getNeighbors(graph, current);
    neighbors.forEach((n) => {
      if (!annotations[n.id] || annotations[n.id]!.marking === 'unexplored') {
        annotations = markQueued(annotations, n, current);
        queue.push(n);
      }
    });
  }
  return [null, [...history, {
    annotations, queue: [...queue], current: null, found: null,
  }]];
}
