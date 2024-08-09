import React from "react";
import { replaceUnderScores } from "../helper";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Label } from 'recharts';

const SampleGraphs = ({ graphValues, info, categories }) => {
  const yesNoTickFormatter = (tick) => (tick === 0 ? "N" : "Y");
  return (<div>
    {(graphValues && Object.keys(graphValues).length > 0) ? (Object.keys(graphValues).map((graph, index) => {
      console.log('INSIDE REPORT GRAPH CONTAINER _FOR ', info[graph].name);
      console.log(graphValues[graph]);
      console.log(info[graph].unit);
      console.log(categories);
      let unit = info[graph].unit ?? "Metric Score";
      return (
        <div>
          {/* Title */}
          <h2>{replaceUnderScores(info[graph].name)}</h2>
          {/* Graph Content */}
          <LineChart
            width={500}
            height={300}
            data={graphValues[graph]}
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
                value: "Year",
                position: "bottom",
              }} />

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
                <Line key={index} type="monotone" dataKey={category} stroke="#0c3960" />
              )
            }
            )}
          </LineChart>
        </div>
      );
    })) : null}
  </div>)
}

export default SampleGraphs;