import React, { useState } from 'react';
import { GraphLayout } from '../features/graph/BaseGraphRenderer';
import { Graph, Node } from '../math/Graph';
import SimpleGraphRenderer from '../features/graph/SimpleGraphRenderer';
import SimpleGraphEditor from '../features/graph/SimpleGraphEditor';

function GraphEditor() {
  const [layout, setLayout] = useState<GraphLayout>({});
  const [graph, setGraph] = useState<Graph<string>>({ nodes: [], edges: [] });

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
        onChange={(newGraph, newLayout) => {
          setGraph(newGraph);
          setLayout(newLayout);
        }}
        graph={graph}
        layout={layout}
      />
      <textarea
        value={JSON.stringify({ graph, layout }, undefined, 2)}
        onChange={(rawSpec) => {
          try {
            // TODO: a graph parser
            if (rawSpec.target.value === '') {
              setGraph({ nodes: [], edges: [] });
              setLayout({ });
            }
            const value = JSON.parse(rawSpec.target.value);
            const { graph: nGraph, layout: nLayout } = value as { graph: Graph<string>, layout: GraphLayout };
            setGraph(nGraph);
            setLayout(nLayout);
          } catch (e) {
            //
          }
        }}
      />
    </div>
  );
}

export default GraphEditor;
