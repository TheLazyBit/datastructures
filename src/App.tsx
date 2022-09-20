import React from 'react';
import './App.scss';
import {
  BrowserRouter, Link, Route, Routes,
} from 'react-router-dom';
import GraphEditor from './pages/GraphEditor';
import BFS from './pages/BFS';
import DemoVNSelect from './common/components/select/DemoVNSelect';

const paths = {
  home: '/',
  graph: {
    base: 'graph',
    bfs: 'bfs',
    editor: 'editor',
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
        <Route path={paths.components.base}>
          <Route path={paths.components.select} element={<DemoVNSelect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
