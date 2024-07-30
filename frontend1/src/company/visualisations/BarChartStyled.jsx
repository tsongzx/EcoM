import { Typography } from '@mui/material';
import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

const BarChartStyled = ({data, title, unit}) => {

  console.log(data);
  console.log(unit);
  const yesNoTickFormatter = (tick) => (tick === 0 ? "N" : "Y");

  return (
    <ResponsiveContainer width="100%" aspect={1.5}>
      {title && <Typography variant="h5" sx={{ textAlign: 'center', height: 'auto' }}>{title}</Typography>}
      <BarChart
        width="100%"
        height="100%"
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          fontFamily={'Roboto, sans-serif'}
          dataKey="year" 
          label={{
            value:"Year",
            position:"bottom",
            fontFamily:'Roboto, sans-serif'
          }}
          
        />
        <YAxis 
          tickCount={unit === "Yes/No" ? 1 : undefined} 
          tickFormatter={unit === "Yes/No" ? yesNoTickFormatter : undefined}
          fontFamily={'Roboto, sans-serif'}
        >         
          <Label 
            value={unit} 
            angle={-90}
            position="left"
            style={{
              textAnchor: 'middle',
              fontFamily: 'Roboto, sans-serif',
            }}
          />
        </YAxis>
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
        {/* <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} /> */}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarChartStyled;