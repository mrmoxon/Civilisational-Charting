import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './Routers/Home';
import CivilisationCompass from './Routers/CivilisationCompass';

const App: React.FC = () => {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/"></Link></li>
          <li><Link to="/civilisation"></Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/civilisation" element={<CivilisationCompass />} />
      </Routes>
    </div>
  );
};

export default App;