import React from 'react';
import './App.scss';
import GraphEditor from './pages/GraphEditor';
import BFS from './pages/BFS';

const page: 'bfs' | 'editor' = 'bfs';

function App() {
  if (page === 'editor') return <GraphEditor />;
  if (page === 'bfs') return <BFS />;
  return null;
}

export default App;
