import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Our Website</h1>
      <p className="mb-4">Explore our projects and tools:</p>
      <ul className="list-disc list-inside">
        <li>
          <Link to="/civilisation" className="text-blue-500 hover:underline">
            Civilisation Compass
          </Link>
          : Quantifying Society's Progress
        </li>
      </ul>
    </div>
  );
};

export default Home;