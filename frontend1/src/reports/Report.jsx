import React, { useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import './Report.css'
import Switch from '@mui/material/Switch';
import {closestCorners, DndContext} from '@dnd-kit/core';
import { DraggableElements } from "./DraggableElements";
import { arrayMove } from "@dnd-kit/sortable";
import Navbar from "../Navbar";
import CustomTextarea from "./CustomTextarea";
import { getCompanyFromRecentlyViewed } from "../helper";
import Pdf from 'react-to-pdf';

/**
 * This function will allow us to modify the Company page to adjust what we would like 
 * the content on our downloaded report to have
 * 
 * @returns {React}
 */
const Report = () => {
    const { companyId } = useParams();
    const [ components , setComponents ] = useState([]);
    const [ showAddText, setShowAddText] = useState(false);
    const ref = useRef();
    const location = useLocation();
    const { id, companyName, framework, year } = location.state || {};
    // set Components to be a list of JSON objects {id: int, type: '', name: ''}, 
    useEffect(() => {
        console.log('Inside Reporing for company: ', parseInt(companyId));
        setComponents([
            {id: 1, type: "text", name: "firstelement", isDisplayed: true},
            {id: 2, type: "text", name: "secondelement", isDisplayed: true},
            {id: 3, type: "text", name: "thirdelement", isDisplayed: true},
            {id: 4, type: "text", name: "fourthelement", isDisplayed: true},
            {id: 5, type: "text", name: "fifthelement", isDisplayed: true},
        ])
    },[]);
    // name will be the string content, id is auto populated.

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

    const newComponents = [
        { id: 1, type: 'title', name: companyInfo.company_name },
        { id: 2, type: 'country', name: companyInfo.headquarter_country },
        // Conditionally add industry if it exists
        ...(companyInfo.industry ? [{ id: 3, type: 'industry', name: companyInfo.industry }] : [])
    ];
    setComponents([...components, ...newComponents]);
};


    const handleClose = (textInfo) => {
        if (!textInfo.message){
            return;
        }
        setShowAddText(false);
        const newComponents = [...components, {id: components.length + 1, type: `text${textInfo.fontWeight}${textInfo.italic ? 'italic' : ''}`, name: textInfo.message, isDisplayed: true}];
        setComponents(newComponents);
    }

    const toggleDisplay = (id) => {
        console.log('Toggling display Property');
        setComponents(components => 
            components.map(c => 
                c.id === id ? { ...c, isDisplayed: !c.isDisplayed } : c
            )
        );
    };
    

    return (
        <div>
        <Navbar/>
        <div className="reportContainer">
            <div className="reportContent" ref={ref}>
                {/* components.map goes here, currently just some placeholder code*/}
            </div>
            <div className="reportControl">
                <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                        <DraggableElements components={components} toggleDisplay={toggleDisplay}/>
                </DndContext>
                <div>
                  <button onClick={() => setShowAddText(!showAddText)}>Add Text</button>
                  {showAddText && <CustomTextarea handleClose={handleClose}/>}
                  <Pdf targetRef={ref} filename={`${companyName}.pdf`}>
                    {({ toPdf }) => (
					  <button onClick={toPdf} className="button">
						Download PDF
					  </button>
				    )}
                  </Pdf>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Report;