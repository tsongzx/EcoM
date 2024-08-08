import { Typography } from '@mui/material';
import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import NumericLabel from 'react-pretty-numbers';

const BarChartStyled = ({data, title, unit, categories}) => {

  console.log(data);
  console.log(unit);
  const yesNoTickFormatter = (tick) => (tick === 0 ? "N" : "Y");

  const getColor = (index) => {
    const colors = ['#8884d8', '#da27e6', '#9913ad', '#9457ff', '#3af082'];
    return colors[index % colors.length];
  };
  
  // const getActiveColor = (index) => {
  //   const colors = ['pink', '#D4A5D7', '#d19ad9', '#ffc658'];
  //   return colors[index % colors.length];
  // };
  
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
          left: 60,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          fontFamily={'Roboto, sans-serif'}
          dataKey="year" 
          label={{
            value:"Year",
            position:"bottom",
            fontFamily:'Roboto, sans-serif',
          }}
          
        />
        <YAxis 
          tickCount={unit === "Yes/No" ? 1 : undefined} 
          tickFormatter={unit === "Yes/No" ? yesNoTickFormatter : undefined}
          fontFamily={'Roboto, sans-serif'}
          tick={{ 
            fontSize: '12px'
          }}
        >         
          <Label 
            value={unit} 
            angle={-90}
            offset={20}
            position="left"
            style={{
              textAnchor: 'middle',
              fontFamily: 'Roboto, sans-serif',
              marginLeft: '50px'
            }}
          />
        </YAxis>
        <Tooltip />
        <Legend
          layout="horizontal"
          verticalAlign="top"
          align="center"
          wrapperStyle={{
            paddingBottom: '20px',
          }}
        />        
        {categories.map((category, index) => (
          <Bar key={index} dataKey={category} fill={getColor(index)} activeBar={<Rectangle fill="pink" stroke="blue" />}/>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

// year, companyName: value, companyB: value, ...
export default BarChartStyled;