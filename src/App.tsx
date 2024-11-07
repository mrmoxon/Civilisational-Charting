import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Routers/Home';
// import CivilisationCompass from './Routers/CivilisationCompass';
import ElectoralAnalysis from './Routers/ElectoralAnalysis';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/civilisation" element={<CivilisationCompass />} /> */}
      <Route path="/electoral-analysis" element={<ElectoralAnalysis />} />
    </Routes>
  );
};

export default App;