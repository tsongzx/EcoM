import { Checkbox } from "@mui/material";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities"

export const PageComponent = ({id, content}) => {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});

    const style = {
        transition, 
        transform: CSS.Transform.toString(transform)
    };

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={style} className="draggable">
            <p>{content}</p>
            <button>show / hide</button>
        </div>
    );
}