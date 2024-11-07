// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ElectoralAnalysis from './pages/ElectoralAnalysis';

const App: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/electoral-analysis" element={<ElectoralAnalysis />} />
      </Routes>
    </div>
  );
};

export default App;
