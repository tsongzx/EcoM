import React from 'react';
import { Font } from '@react-pdf/renderer'
import ReactPDFChart from "react-pdf-charts";
import { LineChart, Line, BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

// Font.register({
//     family: "Roboto",
//     src: "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
//   }
//   );

const wagga = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const ReportBarChart = ({data, unit, categories}) => {

  const getColor = (index) => {
    const colors = ['#8884d8', '#da27e6', '#9913ad', '#9457ff', '#3af082'];
    return colors[index % colors.length];
  };

  const yesNoTickFormatter = (tick) => (tick === 0 ? "N" : "Y");

  return (
    <ReactPDFChart>
      <LineChart
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
        }}/>

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
      {categories.map((category, index) => {
        console.log('category ISSSS ', category);
        return (
        <Line key={index} type="monotone" dataKey={category} stroke="#0c3960"/>
      )}
      )}
      </LineChart>
    </ReactPDFChart>
  );
}

export default ReportBarChart;