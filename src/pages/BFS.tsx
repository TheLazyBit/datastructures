import React, { ReactNode, useState } from 'react';
import { Graph, Node } from '../math/Graph';
import { GraphLayout } from '../features/graph/BaseGraphRenderer';
import SimpleGraphRenderer from '../features/graph/SimpleGraphRenderer';
import exampleGraph from '../exampleGraph';
import './BFS.scss';

function withBfsMarkings() {
  return function withGraph({ data }: Node<string>, circle: ReactNode) {
    let className = data === 'S' ? 'start ' : '';
    className += (data === 'E' ? 'end ' : '');
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

export default function BFS() {
  const [layout, setLayout] = useState<GraphLayout>(exampleGraph.layout);
  const [graph] = useState<Graph<string>>(exampleGraph.graph);

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
        decorateNode={withBfsMarkings()}
      >
        <Legend />
      </SimpleGraphRenderer>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '0.25rem' }}>
        <button type="button" onClick={() => {}}>Next</button>
        <button type="button" onClick={() => {}}>Prev</button>
        <button type="button" onClick={() => {}}>Animate</button>
      </div>
    </div>
  );
}
