import React from "react";
import { SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import { PageComponent } from "./PageComponent";

export const DraggableElements = ({components}) => {
    // set Components to be a list of JSON objects {id: int, type: '', name: '', isDisplayed: true / false}, 
    // name will be the string content, id is auto populated.
    return (
        <div className="column">
            <SortableContext items={components} strategy={verticalListSortingStrategy}>
                {components.map((c, index) => (
                    <PageComponent id = {c.id} content={c.name} key={c.id}/>
                ))}
            </SortableContext>
        </div>
    );
}