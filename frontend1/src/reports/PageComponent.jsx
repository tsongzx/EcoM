import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
import './Report.css';

export const PageComponent = ({ component, toggleDisplay }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: component.id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  };

  const handleToggleDisplay = (e) => {
    e.stopPropagation();
    console.log('Successfully called toggle display in Pagecomponent.jsx');
    toggleDisplay(component.id);
    return;
  }

  return (
    <div className={`draggable ${component.isDisplayed ? 'shown' : 'hidden'}`}>
      <div ref={setNodeRef} {...attributes} {...listeners} style={style} className="dragEnt">
        <p>{component.name}</p>
      </div>
      <button className="toggleDisplayButton" onClick={handleToggleDisplay}>{component.isDisplayed ? 'hide' : 'show'}</button>
    </div>
  );
}