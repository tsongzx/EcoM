import React from 'react';
import SelectFramework from './SelectFramework';
import MetricIndicatorsCard from './MetricIndicatorsCard';
import FrameworkTable from './FrameworkTable';

const Framework = ({
  setSelectedFramework,
  officialFrameworks,
  indicatorsCompany, selectedYear, setSelectedYear, 
  companyName, availableYears, selectedIndicators, selectedMetrics, metricNames, setSelectedIndicators, setSelectedMetrics,
  allIndicators, allIndicatorsInfo, setMetricNames, setAllIndicators,
  sliderValues, sliderValuesFixed, sliderValuesIndicatorFixed, metricNamesFixed,
  selectedMetricsFixed, allIndicatorsFixed, selectedIndicatorsFixed, sliderValuesIndicator,
  setSliderValuesIndicator, setSliderValues, selectedFramework
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
      <div style={{ width: '45%', display: 'flex', flexDirection: 'column'}}>
        <SelectFramework
          setSelectedFramework={setSelectedFramework}
          setMetricNames={setMetricNames}
          setSelectedMetrics={setSelectedMetrics}
          setAllIndicators={setAllIndicators}
          setSelectedIndicators={setSelectedIndicators}
          selectedFramework={selectedFramework}
          officialFrameworks={officialFrameworks}
          />
        <MetricIndicatorsCard
          selectedIndicators={selectedIndicators}
          selectedMetrics={selectedMetrics}
          metricNames={metricNames}
          setSelectedIndicators={setSelectedIndicators}
          setSelectedMetrics={setSelectedMetrics}
          allIndicators={allIndicators}
          allIndicatorsInfo={allIndicatorsInfo}
          setMetricNames={setMetricNames}
          setAllIndicators={setAllIndicators}
          sliderValues={sliderValues}
          sliderValuesFixed={sliderValuesFixed}
          sliderValuesIndicatorFixed={sliderValuesIndicatorFixed}
          metricNamesFixed={metricNamesFixed}
          selectedMetricsFixed={selectedMetricsFixed}
          allIndicatorsFixed={allIndicatorsFixed}
          selectedIndicatorsFixed={selectedIndicatorsFixed}
          sliderValuesIndicator={sliderValuesIndicator}
          setSliderValuesIndicator={setSliderValuesIndicator}
          setSliderValues={setSliderValues}
        />
      </div>
      <div style={{ width: '50%', marginTop: '20px', marginRight: '40px'}}>
        <FrameworkTable
          indicatorsCompany={indicatorsCompany}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear} 
          companyName={companyName}
          availableYears={availableYears}
          selectedFramework={selectedFramework}
          selectedIndicators={selectedIndicators}
          metricNames={metricNames}
          allIndicators={allIndicators}
        />
      </div>
    </div>
  );
}
export default Framework;
