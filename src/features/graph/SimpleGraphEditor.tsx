import React, { ReactNode, useEffect, useState } from 'react';
import { Edge, Graph, Node } from '../../math/Graph';
import { GraphLayout } from './BaseGraphRenderer';
import './styles.scss';

type InputProps = {
  label: ReactNode,
  value: string,
  onChange: (value: string) => void,
  labelProps?: JSX.IntrinsicElements['label']
  inputProps?: Omit<JSX.IntrinsicElements['input'], 'value' | 'onChange'>
};
function Input(props : InputProps) {
  const {
    label, onChange, value, labelProps = {}, inputProps = {},
  } = props;
  return (
    <label className="options" {...labelProps}>
      {label}
      <input
        className="option"
        value={value}
        {...inputProps}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

type OptionsProps = {
  label: ReactNode,
  options: string[],
  value: string,
  onChange: (option: string) => void,
  labelProps?: JSX.IntrinsicElements['label']
};
function Options({
  label,
  options,
  value,
  onChange,
  labelProps = {},
}: OptionsProps) {
  return (
    <label {...labelProps} className="options">
      {label}
      <select
        value={value}
        className="option"
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function updateNodeData<TGraph extends Graph<string>>(graph: TGraph, idx: number, node: Node<string>, data: string, onGraphChange: (graph: TGraph) => void) {
  return onGraphChange({
    ...graph,
    nodes: [
      ...graph.nodes.slice(0, idx),
      {
        ...node,
        data,
      },
      ...graph.nodes.slice(idx + 1),
    ],
  });
}

function updateLayout(data: string, dimension: 'x' | 'y', onLayoutChange: (layout: GraphLayout) => void, layout: GraphLayout, node: Node<string>) {
  const value = parseInt(data, 10);
  if (Number.isNaN(value)) return;
  onLayoutChange({
    ...layout,
    [node.id]: {
      ...layout[node.id]!,
      [dimension]: value,
    },
  });
}

type LocationEditorProps = {
  node: Node<string>,
  layout: GraphLayout,
  onLayoutChange: (layout: GraphLayout) => void,
};
function NodeLocationEditor({
  node, layout, onLayoutChange,
}: LocationEditorProps) {
  return (
    <>
      <Input
        label="X: "
        value={`${layout[node.id]!.x}`}
        onChange={(data) => updateLayout(data, 'x', onLayoutChange, layout, node)}
        inputProps={{ type: 'number' }}
      />
      <Input
        label="Y: "
        value={`${layout[node.id]!.y}`}
        onChange={(data) => updateLayout(data, 'y', onLayoutChange, layout, node)}
        inputProps={{ type: 'number' }}
      />
    </>
  );
}

const ArrowLineDown = <polyline points="0,6 12,24 24,6, 12,12" />;
const ArrowDownSvg = (
  <svg viewBox="0 0 24 24">
    {ArrowLineDown}
  </svg>
);

const ArrowUpSvg = (
  <svg viewBox="0 0 24 24" transform="rotate(180)">
    {ArrowLineDown}
  </svg>
);

type IconButtonProps = {
  children: ReactNode,
  onClick: () => void,
  buttonProps?: Omit<JSX.IntrinsicElements['button'], 'onClick'>
};
function IconButton({
  children,
  onClick,
  buttonProps = {},
}: IconButtonProps) {
  return (
    <button
      type="button"
      className="icon"
      {...buttonProps}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

type SectionProps = {
  title: ReactNode,
  children: ReactNode
  onChange?: (expanded: boolean) => void,
  expanded?: boolean,
};
function Section({
  title,
  expanded,
  children,
  onChange,
}: SectionProps) {
  const [controlled, setControlled] = useState(expanded !== undefined);
  const [isExpanded, setIsExpanded] = useState(expanded ?? false);
  useEffect(() => {
    if (expanded !== undefined) {
      setControlled(true);
      setIsExpanded(expanded);
    } else {
      setControlled(false);
    }
  }, [expanded]);

  return (
    <div className="section">
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div
        className={`title ${isExpanded ? 'open' : ''}`}
        onClick={() => {
          if (!controlled) setIsExpanded(!isExpanded);
          if (onChange) onChange(!isExpanded);
        }}
      >
        {title}
        <IconButton onClick={() => {
          if (!controlled) setIsExpanded(!isExpanded);
          if (onChange) onChange(!isExpanded);
        }}
        >
          {isExpanded ? ArrowUpSvg : ArrowDownSvg}
        </IconButton>
      </div>
      {isExpanded
        && (
        <div className="details">
          {children}
        </div>
        )}
    </div>
  );
}

type EdgeEditorProps<TGraph extends Graph<string>> = {
  graph: TGraph,
  node: Node<string>,
  onEdgeChange: (edges: Edge[]) => void,
};
function NodeEdgeEditor<TGraph extends Graph<string>>({
  graph,
  node,
  onEdgeChange,
}: EdgeEditorProps<TGraph>) {
  const idxedEdges = graph.edges.map((edge, idx) => [edge, idx]) as [Edge, number][];
  const inboundEdges = idxedEdges.filter(([{ to }]) => to === node.id);
  const outboundEdges = idxedEdges.filter(([{ from }]) => from === node.id);
  const ids = graph.nodes.map((n) => n.id);
  return (
    <>
      {
        outboundEdges.map(([edge, idx]) => (
          <div
            style={{ display: 'flex' }}
            key={idx}
          >
            <Options
              label="To: "
              value={`${edge.to}`}
              options={ids.map((it) => `${it}`)}
              labelProps={{
                style: { width: '100%' },
              }}
              onChange={(data) => {
                const value = parseInt(data, 10);
                if (Number.isNaN(value)) return;
                if (!ids.includes(value)) return;
                onEdgeChange(
                  [...graph.edges.slice(0, idx),
                    { ...edge, to: value },
                    ...graph.edges.slice(idx + 1)],
                );
              }}
            />
            <IconButton
              buttonProps={{ style: { width: '1.5rem', height: '1.5rem', marginLeft: 'auto' } }}
              onClick={() => { onEdgeChange([...graph.edges.slice(0, idx), ...graph.edges.slice(idx + 1)]); }}
            >
              -
            </IconButton>
          </div>
        ))
      }
      {
        inboundEdges.map(([edge, idx]) => (
          <div
            style={{ display: 'flex' }}
            key={idx}
          >
            <Options
              label="From: "
              value={`${edge.from}`}
              options={ids.map((it) => `${it}`)}
              labelProps={{
                style: { width: '100%' },
              }}
              onChange={(data) => {
                const value = parseInt(data, 10);
                if (Number.isNaN(value)) return;
                if (!ids.includes(value)) return;
                onEdgeChange(
                  [...graph.edges.slice(0, idx),
                    { ...edge, from: value },
                    ...graph.edges.slice(idx + 1)],
                );
              }}
            />
            <IconButton
              buttonProps={{ style: { width: '1.5rem', height: '1.5rem', marginLeft: 'auto' } }}
              onClick={() => { onEdgeChange([...graph.edges.slice(0, idx), ...graph.edges.slice(idx + 1)]); }}
            >
              -
            </IconButton>
          </div>
        ))
      }
      <IconButton
        buttonProps={{ style: { width: '1.5rem', height: '1.5rem' } }}
        onClick={() => { onEdgeChange([...graph.edges, { from: node.id, to: node.id }]); }}
      >
        +
      </IconButton>
    </>
  );
}

type NodeEditorProps<TGraph extends Graph<string>> = {
  graph: TGraph,
  node: Node<string>,
  layout: GraphLayout,
  onGraphChange: (graph: TGraph) => void,
  onLayoutChange: (layout: GraphLayout) => void,
};
function NodeEditor<TGraph extends Graph<string>>({
  graph,
  layout,
  node,
  onGraphChange,
  onLayoutChange,
}: NodeEditorProps<TGraph>) {
  const idx = graph.nodes.findIndex((n) => node.id === n.id);
  if (idx < 0) throw Error(`${JSON.stringify(node)} is not part of ${JSON.stringify(graph)}`);
  return (
    <Section title={`Node: ${node.id} - ${node.data}`}>
      <Section title="Data">
        <Input
          label="Label: "
          value={node.data}
          onChange={(data: string) => updateNodeData(graph, idx, node, data, onGraphChange)}
          inputProps={{ type: 'text' }}
        />
      </Section>
      <Section title="Edges">
        <NodeEdgeEditor
          node={node}
          graph={graph}
          onEdgeChange={(edges) => onGraphChange({ ...graph, edges })}
        />
      </Section>
      <Section title="Location">
        <NodeLocationEditor
          node={node}
          layout={layout}
          onLayoutChange={onLayoutChange}
        />
      </Section>
      <IconButton
        buttonProps={{ style: { float: 'right', width: '1.5rem', height: '1.5rem' } }}
        onClick={() => {
          onGraphChange({
            ...graph,
            nodes: graph.nodes.filter((n) => n.id !== node.id),
            edges: graph.edges.filter(({ from, to }) => from !== node.id && to !== node.id),
          });
        }}
      >
        -
      </IconButton>
    </Section>
  );
}

const recomputeLayout = <TGraph extends Graph<string>>(newGraph: TGraph, newLayout: GraphLayout) => {
  const ids = new Set(newGraph.nodes.map((it) => it.id));
  const nextLayout = Object.fromEntries(Object
    .entries(newLayout)
    .filter(([k]) => ids.has(+k)));
  ids.forEach((id) => {
    if (!nextLayout[id]) {
      nextLayout[id] = { x: 400, y: 400 };
    }
  });
  console.log(nextLayout);
  return nextLayout;
};

type SimpleGraphEditorProps<TGraph extends Graph<string>> = {
  graph: TGraph
  layout: GraphLayout
  onChange: (graph: TGraph, layout: GraphLayout) => void,
};
export default function SimpleGraphEditor<TGraph extends Graph<string>>({
  graph,
  layout,
  onChange,
}: SimpleGraphEditorProps<TGraph>) {
  const max = graph.nodes.reduce((m, n) => Math.max(m, n.id), 0);

  return (
    <div className="graph editor">
      {graph.nodes.map((node) => (
        <NodeEditor
          key={node.id}
          graph={graph}
          node={node}
          layout={layout}
          onGraphChange={(newGraph) => onChange(newGraph, recomputeLayout(newGraph, layout))}
          onLayoutChange={(newLayout) => onChange(graph, newLayout)}
        />
      ))}
      <IconButton
        buttonProps={{ style: { float: 'right', width: '2.25rem', height: '2.25rem' } }}
        onClick={() => {
          const newGraph = { ...graph, nodes: [...graph.nodes, { id: max + 1, data: `${max + 1}` }] };
          onChange(
            newGraph,
            recomputeLayout(newGraph, layout),
          );
        }}
      >
        +
      </IconButton>
    </div>
  );
}
