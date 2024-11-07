// Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Main content */}
      <div className="flex-grow flex items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-['Roboto'] tracking-wider">
          REAL MACHINES
        </h1>
      </div>
      
      {/* Footer */}
      <div className="p-4 text-center">
        <Link 
          to="/electoral-analysis" 
          className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          civilisation projects
        </Link>
      </div>
    </div>
  );
};

export default Home;