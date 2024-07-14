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
        const companyId_int = Number(companyId.split(" ")[1]);
        addCompanyToList(listId.list_id, companyId_int);
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
        if (hasChecked === true) {
            console.log('true');
            // addCompanyToList(watchlist[index].id, companyId);
            addCompanyToList(watchlist[index].id, Number(companyId.split(" ")[1]));
        } else {
            removeCompanyFromList(watchlist[index].id, companyId);
        }
    }

    //update the button and handle checkbox change, this would require a separate thing that keeps track of the checkboxes
    const handleButtonClick = (index) => {
        console.log(`button was clicked at index ${index}`);
        updateCheckStatus(index);
    }

    const updateCheckStatus = (index) => {
        setWatchlist(prevWatchlist => {
            const newWatchlist = [...prevWatchlist]; // Create a copy of the previous state array
            newWatchlist[index] = { ...newWatchlist[index], isChecked: !newWatchlist[index].isChecked }; // Update the checked property
            console.log('here');
            return newWatchlist; // Return the updated array to update state
        });

        if (watchlist[index].isChecked) {
            addCompanyToList(watchlist[index].id, companyId);
        } else {
            removeCompanyFromList(watchlist[index].id, companyId);
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
                        <Button key={index}>{list.name}
                            <Checkbox {...label} checked={list.isChecked} onChange={(event) => handleCheckboxChange(event, index)}/>
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