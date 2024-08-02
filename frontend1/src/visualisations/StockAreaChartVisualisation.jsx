import React, { PureComponent, useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './StockAreaChartVisualisation.css'
import { getCompanyHistory } from '../helper';
import { format, parseISO } from 'date-fns'

const StockAreaChartVisualisation = ({companyName, period}) => {
    // each entry in companyData comes in the form "2024-07-01T00:00:00-04:00": 198.3000030517578,
    const [companyData, setCompanyData] = useState([]);

    useEffect(() => {
        const initData = async() => {
            const dataresponse = await getCompanyHistory(companyName, period);
            if (dataresponse) {
                const convertedData = Object.entries(dataresponse.High).map(([datetime, value]) => ({date: datetime.split('T')[0] , value}));
                setCompanyData(convertedData);
            } else {
                return null;
            }
        }
        initData();
    },[companyName, period]);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart width={500} height={400} data={companyData}>
                <defs>
                    <linearGradient id='stockchrtgradient' x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#BFC5FC" stopOpacity={0.4}></stop>
                        <stop offset="75%" stopColor="#BFC5FC" stopOpacity={0.05}></stop>
                    </linearGradient>
                </defs>

                <YAxis dataKey="value" axisLine={false} tickLine={false} tickCount={8}/>

                <XAxis dataKey="date" tickFormatter={str => {
                    const date = parseISO(str);
                    if (date.getDate() % 3 === 0) {
                        return format(date, "d MMMM");
                    }
                    return "";
                }}/>

                <CartesianGrid opacity={0.1} vertical={false}/>

                <Tooltip content={<CustomTooltip/>} />

                {/* Need to change the dataKey depending on the data that gets passed in */}
                <Area type="monotone" dataKey="value" stroke="#4757dd" fill="url(stockchrtgradient)"/>

            </AreaChart>
        </ResponsiveContainer>
    );
}

const CustomTooltip = ({active, payload, label}) => {
    //active checks if the tooltip (when u hover over data and see its values) is active or not
    //payload is an array of objects that retains the data for the tooltip
    // label is the label of the data point
    if (active) {
        return (
            <div className='stockareachart-tooltip'>
                <h4>{format(parseISO(label), "eeee d MMM, yyyy")}</h4>
                <p>{payload[0].value.toFixed(2)}</p>
            </div>
        )
    }
    return null;
}

export default StockAreaChartVisualisation;