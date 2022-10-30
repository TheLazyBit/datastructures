import React, { ReactNode, useState } from 'react';
import { Node } from '../math/Graph';
import { GraphLayout } from '../features/graph/BaseGraphRenderer';
import SimpleGraphRenderer from '../features/graph/SimpleGraphRenderer';
import exampleGraph from '../exampleGraph';
import './BFS.scss';
import { specBasedStringConcat } from '../common/strings';
import {
  bfs, BFSState, isLeafPath, Path,
} from '../features/bfs/bfsAlgorithm';

function isOnPathTo(node: Node<string> | null, path: Path<string>): boolean {
  if (!node) return false;
  if (!path) return false;
  if (isLeafPath(path)) return node.id === (path.id);
  return path.node.id === node.id || isOnPathTo(node, path.from);
}

function withBfsMarkings(state: BFSState<string>) {
  return function withGraph(node: Node<string>, circle: ReactNode) {
    const className = specBasedStringConcat({
      start: node.data === 'S',
      end: node.data === 'E',
      queued: state.annotations[node.id]?.marking === 'queued',
      done: state.annotations[node.id]?.marking === 'done',
      current: node.id === state.current?.id,
      unexplored: !state.annotations[node.id] || state.annotations[node.id]?.marking === 'unexplored',
      path: !!state.current && isOnPathTo(node, state.annotations[state.current.id]?.path!),
    }, ' ');
    return <g className={`${className}`}>{circle}</g>;
  };
}

function Legend() {
  return (
    <div
      className="legend"
      style={{
        position: 'absolute', top: 0, right: 0,
      }}
    >
      <div className="start">
        <div className="node preview" />
        Start
      </div>
      <div className="end">
        <div className="node preview" />
        End
      </div>
      <div className="unexplored">
        <div className="node preview" />
        Unexplored
      </div>
      <div className="current">
        <div className="node preview" />
        Current
      </div>
      <div className="queued">
        <div className="node preview" />
        Queued
      </div>
      <div className="done">
        <div className="node preview" />
        Done
      </div>
    </div>
  );
}

function pathString(path: Path<string>): string {
  if (!path) return '';
  if (isLeafPath(path)) return `${path.id}`;
  return `${pathString(path.from)} -> ${path.node.id}`;
}

function pathStringToCurrent(bfsState: BFSState<string>): string | null {
  return bfsState.current && pathString(bfsState.annotations[bfsState.current.id]?.path ?? null);
}

export default function BFS() {
  const [layout, setLayout] = useState<GraphLayout>(exampleGraph.layout);
  const [stateIdx, setStateIdx] = useState(2);
  const { graph } = exampleGraph;
  const [,history] = bfs(
    graph,
    (n) => n.data === 'S',
    (n) => n.data === 'E',
  );
  const bfsState = history[stateIdx]!;

  return (
    <div className="bfs-wrapper" style={{ display: 'flex' }}>
      <SimpleGraphRenderer
        graph={graph}
        layout={layout}
        onLayoutChange={setLayout}
        label={(n: Node<string>) => n.data}
        width={800}
        height={800}
        scale={4}
        decorateNode={withBfsMarkings(bfsState)}
      >
        <Legend />
      </SimpleGraphRenderer>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '0.25rem' }}>
        <span>
          Current:
          {' '}
          {bfsState.current?.id}
        </span>
        <span>
          Queue:
          {' '}
          {bfsState.queue
            .map((n) => n.id)
            .join(',')}
        </span>
        <span>
          Path:
          {' '}
          {pathStringToCurrent(bfsState)}
        </span>
        <span>
          Found:
          {' '}
          {bfsState.found?.id ?? 'N/A'}
        </span>
        <div>
          <button type="button" onClick={() => setStateIdx(Math.max(0, stateIdx - 1))}>Prev</button>
          <button type="button" onClick={() => setStateIdx(Math.min(history.length - 1, stateIdx + 1))}>Next</button>
        </div>
      </div>
    </div>
  );
}
