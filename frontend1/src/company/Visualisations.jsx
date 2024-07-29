import React, { useEffect, useState } from 'react';
import BarChartStyled from './visualisations/BarChartStyled';
import { v4 as uuidv4 } from 'uuid';
import Card from '@mui/material/Card';


const Visualisations = ({companyIndicators, companyName}) => {
  // indicator visualisations
  // get all indicators 
  // add panel to remove / select indicators? - not important
  const [graphValues, setGraphValues] = useState({});
  const [selectedYears, setSelectedYears] = useState([]);  
  // create graph for each indicator
  // group indicators with same unit together - plot together
  
  const get_graph_values = () => {
    const graph_data = {}
    console.log(companyIndicators);
    for (const [year, data] of Object.entries(companyIndicators)) {
      for (const [indicator_name, indicator_data] of Object.entries(data)) {
        // check if within year
        if (!(indicator_data.indicator_year_int in selectedYears)) {
          continue;
        }
        if (!(indicator_name in graph_data)) {
          graph_data[indicator_name] = []
        }
        graph_data[indicator_name].push(
          {
            indicator: indicator_name,
            year: year,
            value: indicator_data.indicator_value,
            company: companyName
          }
        )
      }
    }
    console.log(graph_data);
    return graph_data;
  }

  // const get_graph_values = () => {
  //   graph_data_by_ind = {};  
  //   for (const [year, data] of Object.entries(object)) {
  //     graph_data_by_year[year] = []
  //     for (const entry of data) {
  //       graph_data_by_year[year].push({
  //         indicator: entry.indictor_name,
  //         year: year,
  //         value: data.indicator_value,
  //         company: companyName
  //       })
  //     }
  //   }
  //   return graph_data_by_year;
  // }

  useEffect(() => {
    setGraphValues(get_graph_values(companyIndicators));
    // right now, use all years
    setSelectedYears(Object.keys(companyIndicators));
  }, [companyIndicators]);
  
  
  // later user can toggle by year
  // for now plot all 
  return (
    <>
      {/* {graphValues ? <BarChartStyled data={graphValues['HUMAN_RIGHTS_VIOLATION_PAI']}/> : <p>Loading...</p>} */}


      {Object.keys(graphValues).map((indicator) => {
        return graphValues[indicator] ? (
          <Card key={uuidv4()}>
            <BarChartStyled data={graphValues[indicator]} />
          </Card>
        ) : null;
      })}

    </>
  );
}

export default Visualisations;