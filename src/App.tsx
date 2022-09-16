import React, {
  useState,
} from 'react';
import './App.css';
import { GraphLayout } from './features/graph/BaseGraphRenderer';
import SimpleGraphRenderer from './features/graph/SimpleGraphRenderer';
import { Graph, Node } from './math/Graph';
import SimpleGraphEditor from './features/graph/SimpleGraphEditor';

function App() {
  const [layout, setLayout] = useState<GraphLayout>({
    1: { x: 25, y: 25 },
    2: { x: 75, y: 25 },
    3: { x: 75, y: 75 },
    4: { x: 25, y: 75 },
  });
  const [graph, setGraph] = useState<Graph<string>>({
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
  });
  return (
    <div style={{ display: 'flex' }}>
      <SimpleGraphRenderer
        graph={graph}
        layout={layout}
        onLayoutChange={setLayout}
        label={(n: Node<string>) => n.data}
        width={800}
        height={800}
        scale={4}
      />
      <SimpleGraphEditor
        onChangeGraph={(newGraph) => {
          setGraph(newGraph);

          const ids = new Set(newGraph.nodes.map((it) => it.id));
          const nextLayout = Object.fromEntries(Object
            .entries(layout)
            .filter(([k]) => ids.has(+k)));
          ids.forEach((id) => {
            if (!nextLayout[id]) {
              nextLayout[id] = { x: 400, y: 400 };
            }
          });
          setLayout(nextLayout);
        }}
        graph={graph}
        layout={layout}
      />
    </div>
  );
}

export default App;
