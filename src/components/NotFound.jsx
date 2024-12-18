import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center min-h-96 justify-center text-gray-800 gap-5">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-md text-center px-6">Oops! The page you’re looking for doesn’t exist.</p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2 border-2 border-dashed border-neutral-500 text-neutral-800 font-semibold rounded-xl active:bg-black active:text-white active:border-black hover:border-indigo-800 hover:text-indigo-800 hover:bg-indigo-200/20 shadow-md hover:shadow-xl transition-shadow duration-200"
      >
        Back to Home
      </button>
    </div>
  );
};

export default NotFound;
