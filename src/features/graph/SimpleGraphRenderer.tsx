import React, { MouseEvent, useState } from 'react';
import BaseGraphRenderer, {
  Graph, GraphLayout, Node,
} from './BaseGraphRenderer';

export type SimpleGraphRendererProps<TData, TGraph extends Graph<TData>> = {
  graph: TGraph,
  label: (node: Node<TData>) => string,
  layout: GraphLayout,
  onLayoutChange: (layout: GraphLayout) => void,
};
export default function SimpleGraphRenderer<TData, TGraph extends Graph<TData>>({
  graph,
  label,
  layout,
  onLayoutChange,
}: SimpleGraphRendererProps<TData, TGraph>) {
  const [dragging, setDragging] = useState<number>();

  const isDragging = dragging !== undefined;

  const startDrag = (id: keyof typeof layout) => {
    setDragging(id);
  };

  const drag = (event: MouseEvent<SVGGElement>) => {
    if (!isDragging) return;
    onLayoutChange(({
      ...layout,
      [dragging]: {
        x: layout[dragging].x + event.movementX,
        y: layout[dragging].y + event.movementY,
      },
    }));
  };

  const stopDrag = () => setDragging(undefined);

  return (
    <BaseGraphRenderer
      svgProps={{
        onMouseMove: drag,
        onMouseUp: stopDrag,
        onMouseLeave: stopDrag,
        width: 800,
        height: 800,
      }}
      defs={(
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="10"
          refX={16}
          refY="5"
          orient="auto"
        >
          <polygon points="0 0, 6 5, 0 10" />
        </marker>
      )}
      graph={graph}
      layout={layout}
      renderNode={(g, l, node: Node<TData>) => (
        <g
          onMouseDown={() => startDrag(node.id)}
          style={{ cursor: 'pointer' }}
        >
          <circle
            fill="white"
            stroke="black"
            strokeWidth="1px"
            r={10}
            cx={l[node.id].x}
            cy={l[node.id].y}
          />
          <text
            x={l[node.id].x}
            y={l[node.id].y + 4}
            fontSize={12}
            textAnchor="middle"
            style={{ userSelect: 'none' }}
          >
            {label(node)}
          </text>
        </g>
      )}
      renderEdge={(g, l, edge) => (
        <line
          x1={l[edge.from].x}
          y1={l[edge.from].y}
          x2={l[edge.to].x}
          y2={l[edge.to].y}
          markerEnd="url(#arrowhead)"
          stroke="black"
        />
      )}
    />
  );
}
