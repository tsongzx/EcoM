import React from 'react';
import { useLocation } from 'react-router-dom';

const Compare = () => {
  const location = useLocation();
  const { companies } = location.state;

  return (
    <div>
      <h1>Compare Companies</h1>
      <ul>
        {companies.map((company, index) => (
          <li key={index}>{company.label}</li>
        ))}
      </ul>
    </div>
  );
};

export default Compare;
