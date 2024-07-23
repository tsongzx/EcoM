import {React, useEffect} from 'react';
import { useLocation } from 'react-router-dom';

const Compare = () => {
  const location = useLocation();
  const { companies, selectedFramework } = location.state;

  useEffect(() => {
    console.log(selectedFramework);
  }, [selectedFramework]);

  return (
    <div>
      <h1>Compare Companies</h1>
      <ul>
        {companies.map((company, index) => (
          <li key={index}>{company.label} {company.value}</li>
        ))}
      </ul>
    </div>
  );
};

export default Compare;
