import React, { useEffect, useState } from 'react';
import { getFrameworkAvgGraph, getFrameworkLineGraph } from '../helper';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const FrameworkAverageVisualisation = ({ companyName, view }) => {
  const [graphValues, setGraphValues] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        let data;
        if (view === 'joint') {
          data = await getFrameworkAvgGraph(companyName); // Await the async function
        } else {
          data = await getFrameworkLineGraph(companyName);
        }
        setGraphValues(data);
        if (data.length > 0) {
          const keys = Object.keys(data[0]).filter(key => key !== 'year');
          setCategories(keys);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, [companyName, view]);

  // Display loading indicator if necessary
  if (loading) {
    return <p>Loading...</p>;
  }

  const gradientColors = [
    ['#FF5733', '#FFBD33'],  
    ['#33FF57', '#33FFBD'],  
    ['#3357FF', '#5733FF'],  
    ['#FF33A6', '#FF33FF'],  
    ['#FFD700', '#FF5733'],  
    ['#00CED1', '#4682B4'],  
    ['#8B4513', '#D2691E']   
  ];

  return (
    <>
      {graphValues.length > 0 && categories.length > 0 ? (
        <ResponsiveContainer width="100%" height={380}>
          <AreaChart data={graphValues}>
            <defs>
              {categories.map((category, index) => {
                const [startColor, endColor] = gradientColors[index % gradientColors.length];
                return (
                  <linearGradient id={`gradient-${category}`} key={category} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={startColor} stopOpacity={0.4} />
                    <stop offset="75%" stopColor={endColor} stopOpacity={0.05} />
                  </linearGradient>
                );
              })}
              <linearGradient id='gradient' x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#BFC5FC" stopOpacity={0.4}></stop>
                  <stop offset="75%" stopColor="#BFC5FC" stopOpacity={0.05}></stop>
              </linearGradient>
            </defs>

            <CartesianGrid opacity={0.1} vertical={false} />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            {categories.map((category, index) => {
              return (
                <Area
                  key={category}
                  type="monotone"
                  dataKey={category}
                  name={category}
                  stroke={gradientColors[index % gradientColors.length][0]} 
                  // fill={`url(#gradient-${category})`}
                  fill="url(#gradient)"
                  // stackId="1"
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <p>No data available</p>
      )}
    </>
  );
}

export default FrameworkAverageVisualisation;