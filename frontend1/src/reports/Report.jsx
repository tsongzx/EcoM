import React, { useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import './Report.css'
import {closestCorners, DndContext} from '@dnd-kit/core';
import { DraggableElements } from "./DraggableElements";
import { arrayMove } from "@dnd-kit/sortable";
import Navbar from "../Navbar";
import CustomTextarea from "./CustomTextarea";
import { getCompanyFromRecentlyViewed, getDetailedCompanyInformation } from "../helper";
import { PDFDownloadLink, ReactPDF } from "@react-pdf/renderer";
import { ReportDoc } from "./Document";
import { getPrediction } from "../helper";
import FrameworkTable from "../company/FrameworkTable";
/**
 * This function will allow us to modify the Company page to adjust what we would like 
 * the content on our downloaded report to have
 * In future can change key inside a useEffect so it ensures that the key changes after the components is set
 * @returns {React}
 */
const Report = () => {
    const { companyId } = useParams();
    const [ components , setComponents ] = useState([]);
    const [ showAddText, setShowAddText] = useState(false);
    const [predictedScore, setPredictedScore] = useState({});
    const [key, setKey] = useState(0);
    const ref = useRef();
    const location = useLocation();
    const { id, companyName, framework, year, indicatorsCompany, selectedIndicators, metricNames, allIndicators, metricScores, allIndicatorsInfo } = location.state || {};
    // set Components to be a list of JSON objects {id: int, type: '', name: ''}, 
    useEffect(() => {
        console.log('Inside Reporing for company: ', parseInt(companyId));
        getCompanyMetaInformation();
        // setComponents([
        //     {id: 4, type: "text", name: "firstelement", isDisplayed: true},
        //     {id: 5, type: "text", name: "secondelement", isDisplayed: true},
        //     {id: 6, type: "text", name: "thirdelement", isDisplayed: true},
        //     {id: 7, type: "text", name: "fourthelement", isDisplayed: true},
        //     {id: 8, type: "text", name: "fifthelement", isDisplayed: true},
        // ])
        logAllParams();
        // Get the indicators for the company for the selected year
        const aiPredict = async () => {
            let allPredictedScores = {};
            console.log('ALL INDICATOR INFORMATIOn');
            console.log(allIndicatorsInfo);
            if (!allIndicatorsInfo){
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
          aiPredict();



        // Get Data for each E, S and G Category in the format:
        // {indicator_name, indicator_unit, indicator_value}

        //get graphing data
    },[companyId]);
    // name will be the string content, id is auto populated.

    const logAllParams = () => {
        console.log('LOGGING ALL PARAMS FOR REPORT.JSX');
        console.log('id: ', id, ' company name: ', companyName, ' framework', framework, ' year', year);
        console.log('indicatorsCompany');
        console.log(indicatorsCompany);
        console.log('Selected Indicators');
        console.log(selectedIndicators);
        console.log('metric names');
        console.log(metricNames);
        console.log('AllIndicators');
        console.log(allIndicators);
        console.log('metricScores');
        console.log(metricScores);
        console.log('AllIndicatorsInfo');
        console.log(allIndicatorsInfo);
    }

    // report container will go through the list of components everytime and check what kind of 
    // object it is and render based on it
    // Types include [title, metric scores, visualisation, paragraph] title includes stuff like the name and stuff
    // textb for bold texti for italic textbi for bold and italic
    const getComponentPos = (id) => {
        return components.findIndex(c => c.id === id);
    }

    const handleDragEnd = (event) => {
        const {active, over} = event;
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
    console.log('Getting company Information for Company');
    const companyInfo = await getCompanyFromRecentlyViewed(parseInt(companyId));

    const detailedCompanyInfo = await getDetailedCompanyInformation(companyName);

    const newCompanyComponents = [
        { id: 1, type: 'title', name: companyInfo.company_name, isDisplayed: true },
        { id: 2, type: 'country', name: companyInfo.headquarter_country, isDisplayed: true },
        { id: 3, type: 'year', name: year, isDisplayed: true},
        // Conditionally add industry if it exists
        ...(companyInfo.industry ? [{ id: 4, type: 'industry', name: companyInfo.industry, isDisplayed: true }] : []),
    ];

    //add any information necessary from detailedCompany
    const newComponents = [...newCompanyComponents,
      ...(detailedCompanyInfo ? [{ 
        id: newCompanyComponents.length + 1,
        type: 'longSummary',
        name: detailedCompanyInfo.longBusinessSummary,
        isDisplayed: true
    },{
        id: newCompanyComponents.length + 2,
        type: 'table',
        name: 'Indicators Table',
        isDisplayed: true,
    }] : [{
        id: newCompanyComponents.length + 1,
        type: 'table',
        name: 'Indicators Table',
        isDisplayed: true,
    }]),
    ];

    //Add whatever components we fetched
    console.log(newComponents);
    setComponents([...components, ...newComponents]);
    setKey(prevKey => prevKey + 1);
};


    const handleClose = (textInfo) => {
        if (!textInfo.message){
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
            <Navbar/>
            <div className="reportContainer">
                <div className="reportContent">
                    {/* components.map goes here, currently just some placeholder code*/}
                    <FrameworkTable 
                        indicatorsCompany={indicatorsCompany}
                        selectedYear={year}
                        setSelectedYear={toggleDisplay}
                        companyName={companyName}
                        availableYears={[2018, 2019, 2020, 2021, 2022, 2023, 2024]}
                        selectedFramework={framework}
                        selectedIndicators={selectedIndicators}
                        metricNames={metricNames}
                        allIndicators={allIndicators}
                        metricScores={metricScores}
                        allIndicatorsInfo={allIndicatorsInfo}
                    />
                </div>


                <div className="reportControl">
                    <p>click and drag to reorder your content</p>
                    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                            <DraggableElements components={components} toggleDisplay={toggleDisplay}/>
                    </DndContext>
                    <div>
                    <div>
                        <button onClick={() => setShowAddText(!showAddText)}>Add Text</button>
                        {showAddText && <CustomTextarea handleClose={handleClose}/>}
                    </div>
                    <PDFDownloadLink 
                        key={key}
                        document={<ReportDoc 
                        contentList={components} 
                        companyId={id}
                        companyName={companyName}
                        framework={framework}
                        year={year}
                        indicatorsCompany = {indicatorsCompany}
                        selectedIndicators = {selectedIndicators}
                        metricNames={metricNames}
                        allIndicators={allIndicators}
                        metricScores={metricScores}
                        allIndicatorsInfo={allIndicatorsInfo}
                        predictedScore={predictedScore}
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