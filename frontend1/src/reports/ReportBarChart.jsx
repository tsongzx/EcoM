import React from 'react';
import { Font } from '@react-pdf/renderer'
import ReactPDFChart from "react-pdf-charts";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

// Font.register({
//     family: "Roboto",
//     src: "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
//   }
//   );

const ReportBarChart = ({data, unit, categories}) => {

  const getColor = (index) => {
    const colors = ['#8884d8', '#da27e6', '#9913ad', '#9457ff', '#3af082'];
    return colors[index % colors.length];
  };

  const yesNoTickFormatter = (tick) => (tick === 0 ? "N" : "Y");

  return (
    <ReactPDFChart>
      <BarChart
        width={500}
        height={300}
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
        dataKey="year" 
        label={{
          value:"Year",
          position:"bottom",
        }}
    
      />
      <YAxis 
        tickCount={unit === "Yes/No" ? 1 : undefined} 
        tickFormatter={unit === "Yes/No" ? yesNoTickFormatter : undefined}
      >         
        <Label 
          value={unit} 
          angle={-90}
          position="left"
          style={{
            textAnchor: 'middle',
          }}
        />
      </YAxis>
      <Legend />
      {categories.map((category, index) => (
        <Bar key={index} dataKey={category} fill={getColor(index)} activeBar={<Rectangle fill="pink" stroke="blue" />}/>
      ))}
      {/* <Bar dataKey="value" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />}/> */}
      {/* <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} /> */}
      </BarChart>
    </ReactPDFChart>
  );
}

export default ReportBarChart;