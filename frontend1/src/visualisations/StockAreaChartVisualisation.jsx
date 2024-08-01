import React, { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './StockAreaChartVisualisation.css'

const StockAreaChartVisualisation = ({companyData, xLabel, yLabel}) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart width={500} height={400} data={companyData}>
                <defs>
                    <linearGradient id='stockchrtgradient' x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#BFC5FC" stopOpacity={0.4}></stop>
                        <stop offset="75%" stopColor="#BFC5FC" stopOpacity={0.05}></stop>
                    </linearGradient>
                </defs>

                <YAxis dataKey={yLabel} axisLine={false} tickLine={false} tickCount={8}/>

                <XAxis dataKey={xLabel}/>

                <CartesianGrid opacity={0.1} vertical={false}/>

                <Tooltip content={<CustomTooltip/>} />

                {/* Need to change the dataKey depending on the data that gets passed in */}
                <Area type="monotone" dataKey={yLabel} stroke="#4757dd" fill="url(stockchrtgradient)"/>

            </AreaChart>
        </ResponsiveContainer>
    );
}

// tickFormatter={(str) => 
//     const date = parseISO(str);
//     if (data.getDate() % 7 === 0) {
//         return FormDataEvent(date,)
//     }
// }

const CustomTooltip = ({active, payload, label}) => {
    //active checks if the tooltip (when u hover over data and see its values) is active or not
    //payload is an array of objects that retains the data for the tooltip
    // label is the label of the data point
    if (active) {
        return (
            <div className='stockareachart-tooltip'>
                {/* <h4>{FormData(parseISO(label))}</h4> */}
                <h4>{label}</h4>
                <p>{payload[0].value.toFixed(2)}</p>
            </div>
        )
    }
    return null;
}

export default StockAreaChartVisualisation;