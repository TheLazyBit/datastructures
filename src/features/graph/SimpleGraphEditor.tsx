import React from 'react';
import { Edge, Graph, Node } from '../../math/Graph';
import { GraphLayout } from './BaseGraphRenderer';

function NodeEditor({ nodes, onChangeNodes }: { nodes: Node<string>[], onChangeNodes: (nodes: Node<string>[]) => void }) {
  return (
    <>
      {nodes.map((node, idx) => (
        <div>
          <label htmlFor={`node-${node.id}`}>
            {node.id}
            :
            {' '}
            <input
              id={`node-${node.id}`}
              key={node.id}
              style={{ textAlign: 'right' }}
              type="text"
              value={node.data}
              onChange={(event) => onChangeNodes([
                ...nodes.slice(0, idx),
                { ...node, data: event.target.value },
                ...nodes.slice(idx + 1),
              ])}
            />
          </label>
          <button
            type="button"
            onClick={() => onChangeNodes([...nodes.slice(0, idx), ...nodes.slice(idx + 1)])}
          >
            -
          </button>
        </div>
      ))}
      <div>
        <button
          type="button"
          onClick={() => {
            const id = nodes.reduce((m, n) => Math.max(m, n.id), 0) + 1;
            onChangeNodes([...nodes, { id, data: `${id}` }]);
          }}
        >
          +
        </button>
      </div>
    </>
  );
}

function EdgeEditor({ edges, nodes, onChangeNodes }: { edges: Edge[], nodes: Node<string>[], onChangeNodes: (edges: Edge[]) => void }) {
  const ids = nodes.map((node) => node.id).sort();
  return (
    <>
      {edges.map(({ from, to }, idx) => (
        <div>
          <label htmlFor={`edge-${from}-${to}-${from}`}>
            From
            :
            {' '}
            <select
              value={from}
              id={`edge-${from}-${to}-${from}`}
              key={`edge-${from}-${to}-${from}`}
              style={{ textAlign: 'right' }}
              onChange={(event) => onChangeNodes([
                ...edges.slice(0, idx),
                { to, from: +event.target.value },
                ...edges.slice(idx + 1),
              ])}
            >
              {ids.map((id) => <option value={id}>{id}</option>)}
            </select>
          </label>
          <label htmlFor={`edge-${from}-${to}-${to}`}>
            To
            :
            {' '}
            <select
              value={to}
              id={`edge-${from}-${to}-${to}`}
              key={`edge-${from}-${to}-${to}`}
              style={{ textAlign: 'right' }}
              onChange={(event) => onChangeNodes([
                ...edges.slice(0, idx),
                { from, to: +event.target.value },
                ...edges.slice(idx + 1),
              ])}
            >
              {ids.map((id) => <option value={id}>{id}</option>)}
            </select>
          </label>
          <button
            type="button"
            onClick={() => onChangeNodes([...edges.slice(0, idx), ...edges.slice(idx + 1)])}
          >
            -
          </button>
        </div>
      ))}
      <div>
        {ids.length
          && (
          <button
            type="button"
            onClick={() => {
              onChangeNodes([...edges, {
                from: ids[0],
                to: ids[0],
              }]);
            }}
          >
            +
          </button>
          )}
      </div>
    </>
  );
}

type SimpleGraphEditorProps<TGraph extends Graph<string>> = {
  graph: TGraph
  onChangeGraph: (graph: TGraph) => void,
  layout: GraphLayout
};
export default function SimpleGraphEditor<TGraph extends Graph<string>>({
  graph,
  onChangeGraph,
  layout,
}: SimpleGraphEditorProps<TGraph>) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', width: '100%' }}>
      <div style={{
        padding: '1rem', border: '1px solid black',
      }}
      >
        <NodeEditor
          nodes={graph.nodes}
          onChangeNodes={(nodes) => {
            const ids = new Set(nodes.map((it) => it.id));
            const edges = graph.edges.filter(({ from, to }) => (ids.has(from) && ids.has(to)));
            onChangeGraph({ ...graph, nodes, edges });
          }}
        />
      </div>
      <div style={{
        padding: '1rem', border: '1px solid black',
      }}
      >
        <EdgeEditor edges={graph.edges} nodes={graph.nodes} onChangeNodes={(edges) => onChangeGraph({ ...graph, edges })} />
      </div>
      <textarea style={{ resize: 'none' }} value={JSON.stringify(layout, undefined, 2)} />
    </div>
  );
}
