import React, { useState } from 'react';
import './App.scss';
import {
  BrowserRouter, Link, Route, Routes,
} from 'react-router-dom';
import GraphEditor from './pages/GraphEditor';
import BFS from './pages/BFS';
import DemoVNSelect from './common/components/select/DemoVNSelect';
import { AnimationExperiment1 } from './features/animation/circling-square/animation-experiment1';
import DotsAndLines from './features/animation/dots-and-lines/DotsAndLines';

const paths = {
  home: '/',
  graph: {
    base: 'graph',
    bfs: 'bfs',
    editor: 'editor',
  },
  animation: {
    base: 'animation',
    example1: 'example1',
    dots_and_lines: 'dots-and-lines',
  },
  components: {
    base: 'components',
    select: 'select',
  },
};

function Home() {
  return (
    <div>
      Paths:
      <ul>
        <li><Link to={paths.home}>Home</Link></li>
        <li>
          Graph
          <ul>
            <li><Link to={[paths.graph.base, paths.graph.bfs].join('/')}>BFS</Link></li>
            <li><Link to={[paths.graph.base, paths.graph.editor].join('/')}>Graph Editor</Link></li>
          </ul>
        </li>
        <li>
          Animation
          <ul>
            <li><Link to={[paths.animation.base, paths.animation.example1].join('/')}>Example 1</Link></li>
            <li><Link to={[paths.animation.base, paths.animation.dots_and_lines].join('/')}>Dots And Lines</Link></li>
          </ul>
        </li>
        <li>
          Components
          <ul>
            <li><Link to={[paths.components.base, paths.components.select].join('/')}>Select</Link></li>
          </ul>
        </li>
      </ul>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={paths.home} element={<Home />} />
        <Route path={paths.graph.base}>
          <Route path={paths.graph.bfs} element={<BFS />} />
          <Route path={paths.graph.editor} element={<GraphEditor />} />
        </Route>
        <Route path={paths.animation.base}>
          <Route path={paths.animation.example1} element={<AnimationExperiment1 />} />
          <Route path={paths.animation.dots_and_lines} element={<DotsAndLines />} />
        </Route>
        <Route path={paths.components.base}>
          <Route path={paths.components.select} element={<DemoVNSelect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
