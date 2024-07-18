import React, { useEffect, useState } from "react";
import Modal from '@mui/material/Modal';
import { Button, Typography, Checkbox, TextField, Box } from "@mui/material";
import './WatchlistModal.css'
// import axios from "axios";
import Cookies from "js-cookie";
import {getFormattedUserLists, createList, addCompanyToList, removeCompanyFromList} from "../helper.js";
/**
 * Handling Watchlist modification
 * When the Modal Closes all the changes are reflected
 * @param {Array} content isOpen, handleClose and all the watchlists the user has, updates all the watchlist information
 * @returns {JSX.Element}
 */
const WatchlistModal = ({ isOpen, handleClose, companyId }) => {
    console.log(typeof(companyId));
    const [watchlist, setWatchlist] = useState([]); //this should be populated with whatever lists the user has via backend
    const [listName, setListName] = useState(false);
    const [newWatchlistName, setNewWatchlistName] = useState('');

    const token = Cookies.get('authToken');
    // console.log('opened watchlist modal for company: ', companyId, ' token ', token);

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    // When someone clicks the button to add a new watchlist
    const handleListName = () => setListName(true);

    //Initialise useEffect to set intial state of watchlist
    useEffect(() => {
        const fetchWatchlist = async () => {
            const formattedLists = await getFormattedUserLists(companyId);
            console.log(formattedLists);
            setWatchlist(formattedLists);
        };

        fetchWatchlist();
    }, [companyId]);


    const closeWatchListModal = () => {
        // console.log('closing watchlist Modal...');
        setNewWatchlistName('');
        handleClose();
    }
    const handleKeyPressEsc = (event) => {
        if (event.key === 'Escape' || event.keyCode === 27) {
            console.log('esc was pressed');
            if (listName) {
                setListName(false);
            } else {
                closeWatchListModal();
            }
        }
    };

    //when someone updates the text box
    const handleNewWatchListName = (event) => {
        setNewWatchlistName(event.target.value);
    }

    // when someone submits the new watchlist name
    const handleAddNewWatchlist = async () => {
        if (newWatchlistName.trim() === '') {
            console.log('cannot have watchlist without a name');
            return;
        };
        setListName(false); 
        // update the state of the checkbox, default new checkbox to be true, this list can be passed back
        // to Company to update what watchlists have been checked
        setWatchlist([...watchlist, { name: newWatchlistName, isChecked: true }]);
        //Automatically Add the company
        const listId = await createList(newWatchlistName);
        console.log('NEW LIST ID: ', listId);
        // const companyId_int = Number(companyId.split(" ")[1]);
        addCompanyToList(listId.list_id, companyId);
        console.log('creating new watchlist called ', newWatchlistName);
        setNewWatchlistName('');
        console.log(watchlist);
    }

    //updates the watchlists that contain the company
    const handleCheckboxChange = (event, index) => {
        const hasChecked = event.target.checked;
        console.log(event.target.checked);
        console.log(`Checkbox at ${index} changed to ${event.target.checked ? 'checked' : 'unchecked'}`);
        setWatchlist(prevWatchlist => {
            const newWatchlist = [...prevWatchlist]; // Create a copy of the previous state array
            newWatchlist[index] = { ...newWatchlist[index], isChecked: event.target.checked }; // Update the checked property
            console.log(newWatchlist);
            return newWatchlist; // Return the updated array to update state
        });
        //Add Company to List
        // if (event.target.isChecked) {
        console.log(`AFFECTING ${watchlist[index].id}`);
        if (hasChecked === true) {
            console.log('true');
            // addCompanyToList(watchlist[index].id, companyId);
            addCompanyToList(watchlist[index].id, companyId);
        } else {
            removeCompanyFromList(watchlist[index].id, companyId);
        }
    }

    //update the button and handle checkbox change, this would require a separate thing that keeps track of the checkboxes
    const handleButtonClick = (index) => {
        console.log(`button was clicked at index ${index}`);
        updateCheckStatus(index);
    }

    //This can only happen for currently existing watchlists
    const updateCheckStatus = (index) => {
        console.log('old list');
        console.log(watchlist);
        const oldWatchList = [...watchlist];

        setWatchlist(prevWatchlist => {
            const newWatchlist = [...prevWatchlist]; // Create a copy of the previous state array
            newWatchlist[index] = { ...newWatchlist[index], isChecked: !newWatchlist[index].isChecked }; // Update the checked property
            console.log('here');
            return newWatchlist; // Return the updated array to update state
        });

        console.log(`New list`);
        console.log(watchlist[index].id);
        
        //This continues to use from the old watchlist
        if (!oldWatchList[index].isChecked) {
            console.log(`${oldWatchList[index].id} ${oldWatchList[index].name} has a CHECKED state`);
            addCompanyToList(oldWatchList[index].id, companyId);
        } else {
            console.log(`${oldWatchList[index].id} ${oldWatchList[index].name} has a UNCHECKED state`);
            removeCompanyFromList(oldWatchList[index].id, companyId);
        }
    }

    // also need to apply padding on the bottom of the Modal so that the stick new watchlist doesn't conflict with it
    // if untitled, either throw error or set as untitled
    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            handleAddNewWatchlist();
        }
    }

    return (
        <Modal 
            open = {isOpen}>
            <div className="modalContent" onKeyDown={handleKeyPressEsc}>
                <Typography variant="body2">Add to watchlist</Typography>
                <Button onClick={() => closeWatchListModal()}>X</Button>
                {/* Render exisitng watchlists */}
                <div className="watchlistContainer">
                    {Array.isArray(watchlist) && watchlist?.map((list, index) => (
                        // <Button key={index} onClick={() => handleButtonClick(list.name)}>{list.name}
                        <Button key={index} onClick={() => handleButtonClick(index)}>{list.name}
                            {/* <Checkbox {...label} checked={list.isChecked} onChange={(event) => handleCheckboxChange(event, index)}/> */}
                            {watchlist[index].isChecked ?
                            (<svg width="20px" height="20px" viewBox="0 0 24 24">
                                <g id="🔍-Product-Icons" stroke="#4ca52c" stroke-width="1" fill="#4ca52c" fill-rule="evenodd">
                                    <g id="ic_fluent_checkbox_checked_24_regular" fill="4ca52c" fill-rule="nonzero">
                                        <path d="M18.25,3 C19.7687831,3 21,4.23121694 21,5.75 L21,18.25 C21,19.7687831 19.7687831,21 18.25,21 L5.75,21 C4.23121694,21 3,19.7687831 3,18.25 L3,5.75 C3,4.23121694 4.23121694,3 5.75,3 L18.25,3 Z M18.25,4.5 L5.75,4.5 C5.05964406,4.5 4.5,5.05964406 4.5,5.75 L4.5,18.25 C4.5,18.9403559 5.05964406,19.5 5.75,19.5 L18.25,19.5 C18.9403559,19.5 19.5,18.9403559 19.5,18.25 L19.5,5.75 C19.5,5.05964406 18.9403559,4.5 18.25,4.5 Z M10,14.4393398 L16.4696699,7.96966991 C16.7625631,7.6767767 17.2374369,7.6767767 17.5303301,7.96966991 C17.7965966,8.23593648 17.8208027,8.65260016 17.6029482,8.94621165 L17.5303301,9.03033009 L10.5303301,16.0303301 C10.2640635,16.2965966 9.84739984,16.3208027 9.55378835,16.1029482 L9.46966991,16.0303301 L6.46966991,13.0303301 C6.1767767,12.7374369 6.1767767,12.2625631 6.46966991,11.9696699 C6.73593648,11.7034034 7.15260016,11.6791973 7.44621165,11.8970518 L7.53033009,11.9696699 L10,14.4393398 L16.4696699,7.96966991 L10,14.4393398 Z" id="🎨Color">
                            </path></g></g>
                            </svg>)
                        : (<svg width="20px" height="20px" viewBox="0 0 24 24">
                            <g id="🔍-Product-Icons" stroke="black" stroke-width="1" fill="none" fill-rule="evenodd">
                                <g id="ic_fluent_checkbox_unchecked_24_regular" fill="#212121" fill-rule="nonzero">
                                    <path d="M5.75,3 L18.25,3 C19.7687831,3 21,4.23121694 21,5.75 L21,18.25 C21,19.7687831 19.7687831,21 18.25,21 L5.75,21 C4.23121694,21 3,19.7687831 3,18.25 L3,5.75 C3,4.23121694 4.23121694,3 5.75,3 Z M5.75,4.5 C5.05964406,4.5 4.5,5.05964406 4.5,5.75 L4.5,18.25 C4.5,18.9403559 5.05964406,19.5 5.75,19.5 L18.25,19.5 C18.9403559,19.5 19.5,18.9403559 19.5,18.25 L19.5,5.75 C19.5,5.05964406 18.9403559,4.5 18.25,4.5 L5.75,4.5 Z" id="🎨Color">
                        </path>
                                </g>
                            </g>
                        </svg>)
                        }
                        </Button>
                    ))}
                </div>
                <div className="modifyWatchlists">
                    {listName ?
                    (<Box sx={{ display: 'flex', alignItems: 'center'}}>
                        <TextField fullWidth id="standard-basic" label="new watchlist name" variant="standard" defaultValue={newWatchlistName} onChange={handleNewWatchListName} onKeyDown={handleEnter}/>
                        <Button variant="outlined" onClick={handleAddNewWatchlist}>OK</Button>
                    </Box>) 
                    : (<Button onClick={handleListName}>+ New WatchList</Button>)
                    }
                </div>
            </div>
        </Modal>
    );
};

export default WatchlistModal;