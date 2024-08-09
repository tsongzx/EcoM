import React, { useEffect, useState } from "react";
import Modal from '@mui/material/Modal';
import { Button, Box } from "@mui/material";
import './company_css/ListModal.css';
import CloseIcon from '@mui/icons-material/Close';
import Input from '@mui/joy/Input';
import { getFormattedUserLists, createList, addCompanyToList, removeCompanyFromList } from "../helper.js";
import SelfExpiringMessage from "../assets/SelfExpiringMessage.jsx";
/**
 * Handling list modification
 * When the Modal Closes all the changes are reflected
 * @param {Array} content isOpen, handleClose and all the lists the user has, updates all the list information
 * @returns {JSX.Element}
 */
const ListModal = ({ isOpen, handleClose, companyId }) => {
    console.log(typeof (companyId));
    const [lists, setLists] = useState([]); //this should be populated with whatever lists the user has via backend
    const [listName, setListName] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [message, setMessage] = useState('');
    const [msgIsOpen, setMsgIsOpen] = useState(false);

    // When someone clicks the button to add a new list
    const handleListName = () => setListName(true);

    //Initialise useEffect to set intial state of list
    useEffect(() => {
        const fetchList = async () => {
            const formattedLists = await getFormattedUserLists(companyId);
            console.log(formattedLists);
            setLists(formattedLists);
        };
        if (companyId) {
            fetchList();
        }

    }, [companyId]);


    const closeListModal = () => {
        // console.log('closing list Modal...');
        setNewListName('');
        handleClose();
    }
    const handleKeyPressEsc = (event) => {
        if (event.key === 'Escape' || event.keyCode === 27) {
            console.log('esc was pressed');
            if (listName) {
                setListName(false);
            } else {
                closeListModal();
            }
        }
    };

    //when someone updates the text box
    const handleNewListName = (event) => {
        setNewListName(event.target.value);
    }

    // when someone submits the new list name
    const handleAddNewList = async () => {
        if (newListName.trim() === '') {
            console.log('cannot have list without a name');
            setMessage('Please give your new list a name');
            setMsgIsOpen(true);
            return;
        };
        setListName(false);
        // update the state of the checkbox, default new checkbox to be true, this list can be passed back
        // to Company to update what lists have been checked
        setLists([...lists, { name: newListName, isChecked: true }]);
        //Automatically Add the company
        const listId = await createList(newListName);
        console.log('NEW LIST ID: ', listId);
        // const companyId_int = Number(companyId.split(" ")[1]);
        addCompanyToList(listId.list_id, companyId);
        console.log('creating new list called ', newListName);
        setNewListName('');
        console.log(lists);
    }

    console.log(lists);
    //update the button and handle checkbox change, this would require a separate thing that keeps track of the checkboxes
    const handleButtonClick = (index) => {
        console.log(`button was clicked at index ${index}`);
        updateCheckStatus(index);
    }

    //This can only happen for currently existing lists
    const updateCheckStatus = (index) => {
        console.log('old lists');
        console.log(lists);
        const oldLists = [...lists];

        setLists(prevLists => {
            const newLists = [...prevLists]; // Create a copy of the previous state array
            newLists[index] = { ...newLists[index], isChecked: !newLists[index].isChecked }; // Update the checked property
            console.log('here');
            return newLists; // Return the updated array to update state
        });

        console.log(`New list`);
        console.log(lists[index].id);

        //This continues to use from the old list
        if (!oldLists[index].isChecked) {
            console.log(22, ` ${oldLists[index].name} has a CHECKED state`);
            addCompanyToList(oldLists[index].id, companyId);
        } else {
            console.log(`${oldLists[index].id} ${oldLists[index].name} has a UNCHECKED state`);
            removeCompanyFromList(oldLists[index].id, companyId);
        }
    }

    // also need to apply padding on the bottom of the Modal so that the stick new list doesn't conflict with it
    // if untitled, either throw error or set as untitled
    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            handleAddNewList();
        }
    }

    return (
        <Modal
            open={isOpen}>
            <div className="modalContent" onKeyDown={handleKeyPressEsc}>
                <div className="modalHeaderContent">
                    <Button disableRipple id="closeListModal-button" onClick={() => closeListModal()}><CloseIcon /></Button>
                    {/* Render exisitng lists */}
                    <h3 id='listDescriptorText' variant="body2">Add to list</h3>
                </div>
                <div className="listContainer">
                    {Array.isArray(lists) && lists?.map((list, index) => (
                        // <Button key={index} onClick={() => handleButtonClick(list.name)}>{list.name}
                        <button className={`list-button ${list.isChecked ? 'checkedwLbutton' : ''}`} key={index} onClick={() => handleButtonClick(index)}>{list.name}
                            {/* <Checkbox {...label} checked={list.isChecked} onChange={(event) => handleCheckboxChange(event, index)}/> */}
                            {list.isChecked ?
                                (<svg width="20px" height="20px" viewBox="0 0 24 24">
                                    <g id="🔍-Product-Icons" stroke="#4ca52c" strokeWidth="1" fill="#4ca52c" fillRule="evenodd">
                                        <g id="ic_fluent_checkbox_checked_24_regular" fill="4ca52c" fillRule="nonzero">
                                            <path d="M18.25,3 C19.7687831,3 21,4.23121694 21,5.75 L21,18.25 C21,19.7687831 19.7687831,21 18.25,21 L5.75,21 C4.23121694,21 3,19.7687831 3,18.25 L3,5.75 C3,4.23121694 4.23121694,3 5.75,3 L18.25,3 Z M18.25,4.5 L5.75,4.5 C5.05964406,4.5 4.5,5.05964406 4.5,5.75 L4.5,18.25 C4.5,18.9403559 5.05964406,19.5 5.75,19.5 L18.25,19.5 C18.9403559,19.5 19.5,18.9403559 19.5,18.25 L19.5,5.75 C19.5,5.05964406 18.9403559,4.5 18.25,4.5 Z M10,14.4393398 L16.4696699,7.96966991 C16.7625631,7.6767767 17.2374369,7.6767767 17.5303301,7.96966991 C17.7965966,8.23593648 17.8208027,8.65260016 17.6029482,8.94621165 L17.5303301,9.03033009 L10.5303301,16.0303301 C10.2640635,16.2965966 9.84739984,16.3208027 9.55378835,16.1029482 L9.46966991,16.0303301 L6.46966991,13.0303301 C6.1767767,12.7374369 6.1767767,12.2625631 6.46966991,11.9696699 C6.73593648,11.7034034 7.15260016,11.6791973 7.44621165,11.8970518 L7.53033009,11.9696699 L10,14.4393398 L16.4696699,7.96966991 L10,14.4393398 Z" id="🎨Color">
                                            </path></g></g>
                                </svg>)
                                : (<svg width="20px" height="20px" viewBox="0 0 24 24">
                                    <g id="🔍-Product-Icons" stroke="black" strokeWidth="1" fill="none" fillRule="evenodd">
                                        <g id="ic_fluent_checkbox_unchecked_24_regular" fill="#212121" fillRule="nonzero">
                                            <path d="M5.75,3 L18.25,3 C19.7687831,3 21,4.23121694 21,5.75 L21,18.25 C21,19.7687831 19.7687831,21 18.25,21 L5.75,21 C4.23121694,21 3,19.7687831 3,18.25 L3,5.75 C3,4.23121694 4.23121694,3 5.75,3 Z M5.75,4.5 C5.05964406,4.5 4.5,5.05964406 4.5,5.75 L4.5,18.25 C4.5,18.9403559 5.05964406,19.5 5.75,19.5 L18.25,19.5 C18.9403559,19.5 19.5,18.9403559 19.5,18.25 L19.5,5.75 C19.5,5.05964406 18.9403559,4.5 18.25,4.5 L5.75,4.5 Z" id="🎨Color">
                                            </path>
                                        </g>
                                    </g>
                                </svg>)
                            }
                        </button>
                    ))}
                </div>
                <div className="modifyLists">
                    {listName ?
                        (<Box sx={{ display: 'flex', alignItems: 'center', width: '100%', color: 'black' }}>
                            <Input sx={{ flexGrow: '1', marginRight: '3px' }} variant="soft" label="new list name" placeholder="new list name" defaultValue={newListName} onChange={handleNewListName} onKeyDown={handleEnter} />
                            <Button id="addNewlistButton" variant="outlined" sx={{ color: 'black', borderBlockColor: 'black', backgroundColor: 'white' }} onClick={handleAddNewList}>OK</Button>
                        </Box>)
                        : (<Button id="setAddlistbutton" onClick={handleListName} sx={{ color: 'black' }}>New List</Button>)
                    }
                </div>
            </div>
            {/* {msgIsOpen && message && (<SelfExpiringMessage message={message} onExpiry={() => setMsgIsOpen(false)}/>)} */}
        </Modal>
    );
};

export default ListModal;