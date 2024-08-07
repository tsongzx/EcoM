import React, { useEffect, useState } from 'react';
import { getFrameworkAvgGraph } from '../helper';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FrameworkAverageVisualisation = ({ companyName }) => {
  const [graphValues, setGraphValues] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const data = await getFrameworkAvgGraph(companyName); // Await the async function
        console.log(data);
        setGraphValues(data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, [companyName]);

  // Display loading indicator if necessary
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {graphValues.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={graphValues}>
            <defs>
              <linearGradient id='stockchrtgradient' x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#BFC5FC" stopOpacity={0.4} />
                <stop offset="75%" stopColor="#BFC5FC" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid opacity={0.1} vertical={false} />
            <XAxis dataKey="year" />
            <YAxis dataKey="average" />
            <Tooltip />

            <Area 
              type="monotone" 
              dataKey="average" 
              stroke="#4757dd" 
              fill="url(#stockchrtgradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <p>No data available</p>
      )}
    </>
  );
}

export default FrameworkAverageVisualisation;