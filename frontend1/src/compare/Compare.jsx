import {React, useEffect} from 'react';
import { useLocation } from 'react-router-dom';

const Compare = () => {
  const location = useLocation();
  const { companies, selectedIndicators } = location.state;

  useEffect(() => {
    console.log(selectedIndicators);
  }, []);

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
