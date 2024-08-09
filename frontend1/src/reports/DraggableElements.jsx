import React from "react";
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { PageComponent } from "./PageComponent";

export const DraggableElements = ({ components, toggleDisplay }) => {
  // set Components to be a list of JSON objects {id: int, type: '', name: '', isDisplayed: true / false}, 
  // name will be the string content, id is auto populated.
  return (
    <div className="column">
      <SortableContext items={components} strategy={verticalListSortingStrategy}>
        {components.map((c) => (
          <PageComponent component={c} key={c.id} toggleDisplay={toggleDisplay} />
        ))}
      </SortableContext>
    </div>
  );
}