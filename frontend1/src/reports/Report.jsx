import React, { useState } from "react";
import './Report.css'
import Switch from '@mui/material/Switch';
import {closestCorners, DndContext} from '@dnd-kit/core';
import { DraggableElements } from "./DraggableElements";
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

    // set Components to be a list of JSON objects {id: int, type: '', name: ''}, 
    // name will be the string content, id is auto populated.

    // report container will go through the list of components everytime and check what kind of 
    // object it is and render based on it

    const getComponentPos = (id) => {
        components.findIndex(c => c.id === id);
    }

    const handleDragEnd = (event) => {
        const {active, over} = event;
        if (active.id === over.id) return;
        setComponents(components => {
            const originalPosition = getComponentPos(active.id);
            const newPosition = getTaskPos(over.id);

            return arrayMove(components, originalPosition, newPosition);
        });
    }

    return (
        <div className="reportContainer">
            <div className="reportContent">

            </div>
            <div className="reportControl">
                <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                        <DraggableElements components={components}/>
                </DndContext>
                <div>
                    <button>Add Text</button>
                </div>
            </div>
        </div>
    );
}

export default Report;