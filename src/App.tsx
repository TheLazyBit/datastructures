import React, {
  useMemo,
  useState,
} from 'react';
import './App.css';
import {
  Graph, GraphLayout, Node,
} from './features/graph/BaseGraphRenderer';
import SimpleGraphRenderer from './features/graph/SimpleGraphRenderer';

function App() {
  const [layout, setLayout] = useState<GraphLayout>({
    1: { x: 25, y: 25 },
    2: { x: 75, y: 25 },
    3: { x: 75, y: 75 },
    4: { x: 25, y: 75 },
  });
  const graph = useMemo(() => ({
    nodes: [
      { id: 1, data: '1' },
      { id: 2, data: '2' },
      { id: 3, data: '3' },
      { id: 4, data: '4' },
    ],
    edges: [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 1 },
    ],
  }) as Graph<string>, []);
  return (
    <SimpleGraphRenderer
      graph={graph}
      layout={layout}
      onLayoutChange={setLayout}
      label={(n: Node<string>) => n.data}
    />
  );
}

export default App;
