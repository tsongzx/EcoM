import React from "react";
import './ContextMenu.css'

const ContextMenu = ({
    rightClickItem,
    positionX,
    positionY,
    isToggled,
    buttons,
    contextMenuRef
}) => {
    console.log('RENDERING A CONTEXT MENU AT ',positionX, ', ', positionY);
    return (
        <menu style={{
            top: positionY + 2 + 'px',
            left: positionX + 2 + 'px'
        }} 
        className={`context-menu ${isToggled ? 'active' : ''}`}
        ref = {contextMenuRef}> 
            
            {buttons.map((button, index)=>{
                function handleClick(e) {
                    e.stopPropagation()
                    button.onClick(e, rightClickItem);
                }

                return (
                    <button onClick={handleClick} key={index} className="context-menu-button">
                        <span>{button.text}</span>
                    </button>
                )
            })}
        </menu>
    )
}

export default ContextMenu;