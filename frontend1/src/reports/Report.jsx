import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import './Report.css'
import { closestCorners, DndContext } from '@dnd-kit/core';
import { DraggableElements } from "./DraggableElements";
import { arrayMove } from "@dnd-kit/sortable";
import Navbar from "../navbar/Navbar";
import CustomTextarea from "./CustomTextarea";
import { fetchCompanyInfo, getDetailedCompanyInformation } from "../helper";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ReportDoc } from "./Document";
import { getPrediction, getIndicatorsInfoByName } from "../helper";
import SampleGraphs from "./SampleGraphs";
import SampleTable from "./SampleTable";
import SelfExpiringMessage from "../assets/SelfExpiringMessage";
/**
 * This function will allow us to modify the Company page to adjust what we would like 
 * the content on our downloaded report to have
 * In future can change key inside a useEffect so it ensures that the key changes after the components is set
 * @returns {React}
 */
const Report = () => {
    const { companyId } = useParams();
    const [components, setComponents] = useState([]);
    const [showAddText, setShowAddText] = useState(false);
    const [predictedScore, setPredictedScore] = useState({});

    const [message, setMessage] = useState('');
    const [showMsg, setShowMsg] = useState(false);

    //FOR INDICATOR GRAPHING
    const [indicatorInfo, setIndicatorInfo] = useState({});
    const [graphValues, setGraphValues] = useState({});

    const [key, setKey] = useState(0);
    const location = useLocation();
    const { id, companyName, framework, year, indicatorsCompany, selectedIndicators, metricNames, allIndicators, metricScores, allIndicatorsInfo, graphStateChange, selectedMetrics, ticker } = location.state || {};
    // set Components to be a list of JSON objects {id: int, type: '', name: ''}, 
    useEffect(() => {
        console.log('Inside Reporing for company: ', parseInt(companyId));
        getCompanyMetaInformation();
        // Get the indicators for the company for the selected year
        const aiPredict = async () => {
            let allPredictedScores = {};
            console.log('ALL INDICATOR INFORMATIOn');
            console.log(allIndicatorsInfo);
            if (!allIndicatorsInfo) {
                return;
            }
            for (const indicator of Object.values(allIndicatorsInfo)) {
                let score = await getPrediction(indicator.name, indicator.unit, companyName);
                if (score) {
                    let newObj = {};
                    newObj['id'] = indicator.id;
                    newObj['indicator_name'] = score.indicator_name;
                    newObj['prediction'] = score.prediction;
                    allPredictedScores[score.indicator_id] = newObj;
                }
            }
            setPredictedScore(allPredictedScores);
        }

        const getIndicatorInfo = async () => {
            const info = await getIndicatorsInfoByName();
            console.log('REPORT JSX INFO');
            console.log(info);
            setIndicatorInfo(info);
        }

        const get_graph_values = () => {
            const graph_data = {};
            for (const [year, data] of Object.entries(indicatorsCompany)) {
                for (const [indicator_name, indicator_data] of Object.entries(data)) {
                    // Check if within selected years
                    if (!Object.keys(indicatorsCompany).includes(indicator_data.indicator_year_int.toString())) {
                        // console.log(`Skipping year ${indicator_data.indicator_year_int} as it is not in selectedYears`);
                        continue;
                    }

                    if (!(indicator_name in graph_data)) {
                        graph_data[indicator_name] = [];
                    }

                    graph_data[indicator_name].push({
                        indicator: indicator_name,
                        year: year,
                        [companyName]: indicator_data.indicator_value,
                        // company: companyName,
                    });
                }
            }
            console.log('REPORT JSX graph_data:', graph_data);
            setGraphValues(graph_data);
            // return graph_data;
        };

        aiPredict();
        getIndicatorInfo();
        get_graph_values();
    }, [companyId]);

    const getComponentPos = (id) => {
        return components.findIndex(c => c.id === id);
    }

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!active || !over || !active.id || !over) {
            setMessage('sorry your content is still loading...');
            setShowMsg(true);
            return;
        }
        if (active.id === over.id) return;
        setComponents(components => {
            const originalPosition = getComponentPos(active.id);
            const newPosition = getComponentPos(over.id);

            return arrayMove(components, originalPosition, newPosition);
        });
        setKey(prevKey => prevKey + 1);
    }

    //{
    //   "perm_id": "4295858410",
    //   "industry": null,
    //   "id": 2,
    //   "headquarter_country": "Australia",
    //   "company_name": "Rey Resources Ltd"
    // }
    const getCompanyMetaInformation = async () => {
        // const headerTypes = ['country', 'year', 'industry', 'longSummary'];
        console.log('Getting company Information for Company');
        const companyInfo = await fetchCompanyInfo(parseInt(companyId));

        const detailedCompanyInfo = await getDetailedCompanyInformation(ticker);

        const newCompanyComponents = [
            { id: 1, type: 'title', name: companyInfo.company_name, isDisplayed: true },
            { id: 2, type: 'country', name: companyInfo.headquarter_country, isDisplayed: true },
            { id: 3, type: 'year', name: year, isDisplayed: true },
            // Conditionally add industry if it exists
            ...(companyInfo.industry ? [{ id: 4, type: 'industry', name: companyInfo.industry, isDisplayed: true }] : []),
        ];

        //add any information necessary from detailedCompany
        const newComponents = [...newCompanyComponents,
        ...(('longBusinessSummary' in detailedCompanyInfo) ? [{
            id: newCompanyComponents.length + 1,
            type: 'longSummary',
            name: detailedCompanyInfo.longBusinessSummary,
            isDisplayed: true
        }, {
            id: newCompanyComponents.length + 2,
            type: 'table',
            name: 'Indicators Table',
            isDisplayed: true,
        }, {
            id: newCompanyComponents.length + 3,
            type: 'iGraph',
            name: 'Indicators Graphs',
            isDisplayed: true,
        }
        ] : [{
            id: newCompanyComponents.length + 1,
            type: 'table',
            name: 'Indicators Table',
            isDisplayed: true,
        }, {
            id: newCompanyComponents.length + 2,
            type: 'iGraph',
            name: 'Indicators Graphs',
            isDisplayed: true,
        }]),
        ];

        //Add whatever components we fetched
        console.log(newComponents);
        setComponents([...components, ...newComponents]);
        setKey(prevKey => prevKey + 1);
    };


    const handleClose = (textInfo) => {
        if (!textInfo.message) {
            return;
        }
        setShowAddText(false);
        const newComponents = [...components, {
            id: components.length + 1,
            type: 'text', name: textInfo.message,
            isDisplayed: true,
            fw: textInfo.fontWeight,
            italic: `${textInfo.italic ? 'italic' : 'normal'}`
        }];
        console.log(newComponents);
        setComponents(newComponents);
        setKey(prevKey => prevKey + 1);
    }

    const toggleDisplay = (id) => {
        console.log('Toggling display Property');
        setComponents(components =>
            components.map(c =>
                c.id === id ? { ...c, isDisplayed: !c.isDisplayed } : c
            )
        );
        setKey(prevKey => prevKey + 1);
    };


    return (
        <div>
            <Navbar />
            <div className="reportContainer">
                <div className="reportContent">
                    {/* components.map goes here, currently just some placeholder code*/}
                    {components.map(c => {
                        if (c.type === 'title' && c.isDisplayed) {
                            return <h2>{c.name}</h2>
                        }
                        else if (['country', 'year', 'industry', 'longSummary'].includes(c.type) && c.isDisplayed) {
                            return <p>{c.name}</p>
                        }
                        else if (c.type === 'text' && c.isDisplayed) {
                            return <p style={{ fontWeight: c.fw, fontStyle: c.italic }}>{c.name}</p>
                        }
                        else if (c.type === 'table' && c.isDisplayed) {
                            return <SampleGraphs graphValues={graphValues} info={indicatorInfo} categories={[companyName]} />
                        }
                        else if (c.type === 'table') {
                            return <SampleTable
                                indicatorsCompany={indicatorsCompany}
                                selectedYear={year}
                                selectedFramework={framework}
                                selectedIndicators={selectedIndicators}
                                metricNames={metricNames}
                                allIndicators={allIndicators}
                                metricScores={metricScores}
                                allIndicatorsInfo={allIndicatorsInfo}
                                predictedScore={predictedScore}
                            />
                        }
                    })}
                </div>


                <div className="reportControl">
                    <p>click and drag to reorder your content</p>
                    {showMsg && <SelfExpiringMessage message={message} onExpiry={() => setShowMsg(false)} />}
                    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                        <DraggableElements components={components} toggleDisplay={toggleDisplay} />
                    </DndContext>
                    <div>
                        <div>
                            <button onClick={() => setShowAddText(!showAddText)}>Add Text</button>
                            {showAddText ? <CustomTextarea handleClose={handleClose} /> : (<div style={{ height: '152px' }}></div>)}
                        </div>
                        <PDFDownloadLink
                            className="download-pdf-link"
                            key={key}
                            document={<ReportDoc
                                contentList={components}
                                companyId={id}
                                companyName={companyName}
                                framework={framework}
                                year={year}
                                indicatorsCompany={indicatorsCompany}
                                selectedIndicators={selectedIndicators}
                                metricNames={metricNames}
                                allIndicators={allIndicators}
                                metricScores={metricScores}
                                allIndicatorsInfo={allIndicatorsInfo}
                                predictedScore={predictedScore}
                                graphStateChange={graphStateChange}
                                selectedMetrics={selectedMetrics}

                                indicatorInfo={indicatorInfo}
                                graphValues={graphValues}
                            />} fileName={`${companyName}.pdf`}>
                            {({ blob, url, loading, error }) =>
                                loading ? 'Loading document...' : 'Download PDF'
                            }
                        </PDFDownloadLink>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Report;