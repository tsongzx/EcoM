import React from 'react';
import ReactPDFChart from "react-pdf-charts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Label } from 'recharts';

// Font.register({
//     family: "Roboto",
//     src: "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
//   }
//   );

const ReportBarChart = ({data, unit, categories}) => {

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