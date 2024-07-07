import React, { useEffect, useState } from "react";
import Modal from '@mui/material/Modal';
import { Button, Typography, Checkbox, TextField, Box } from "@mui/material";
import './WatchlistModal.css'
import axios from "axios";
import Cookies from "js-cookie";
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
    //get 

    //ALL THESE FUNCTIONS COULD HONESTLY BE MOVED TO A helper.js
    const fetchLists = async() => {
        //get the names of all the lists and whether the company is contained inside that list
        //contain that information inside watchlist in the set State

        //also return whether the list contains such element
        try {
            const response = await axios.get('http://127.0.0.1:8000/lists', {
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('successfully returned lists');
            return response.data.lists;
        } catch (error) {
            console.log(`error fetching the user's watchlists`, error);
        }
    }

    //creates a new Watchlist with name : name
    const createList = async ({name}) => {
        //create list
        try {
            const response = await axios.post('http://127.0.0.1:8000/list', {
                'list_name': name,
            }, 
            {headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }});
            //if successful
            console.log('successfully added List name: ', name,  ' list id :', response.data.list_id);
            return response.data.list_id;
        } catch (error) {
            console.log(error);
        }

    };

    //add a company to list id
    const addCompanyToList = async ({listId, companyId }) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/list/company', {
                list_name: listId,
                company_name: companyId,
            }, {headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }});
            //if successfully added
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    // When someone clicks the button to add a new watchlist
    const handleListName = () => setListName(true);

    const closeWatchListModal = () => {
        console.log('closing watchlist Modal...');
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
    const handleAddNewWatchlist = () => {
        if (newWatchlistName.trim() === '') {
            console.log('cannot have watchlist without a name');
            return;
        };

        setListName(false);
        
        // update the state of the checkbox, default new checkbox to be true, this list can be passed back
        // to Company to update what watchlists have been checked
        setWatchlist([...watchlist, { name: newWatchlistName, checked: true }]);
        createList(newWatchlistName);
        console.log('creating new watchlist called ', newWatchlistName);
        setNewWatchlistName('');
        console.log(watchlist);
    }

    //updates the watchlists that contain the company
    const handleCheckboxChange = (event, index) => {
        console.log(watchlist);
        console.log(`Checkbox at ${index} changed to ${event.target.checked ? 'checked' : 'unchecked'}`);
        setWatchlist(prevWatchlist => {
            const newWatchlist = [...prevWatchlist]; // Create a copy of the previous state array
            newWatchlist[index] = { ...newWatchlist[index], checked: event.target.checked }; // Update the checked property
            return newWatchlist; // Return the updated array to update state
        });
    }

    //update the button and handle checkbox change, this would require a separate thing that keeps track of the checkboxes
    const handleButtonClick = (index) => {
        console.log(`button was clicked at index ${index}`);
        updateCheckStatus(index);
    }

    const updateCheckStatus = (index) => {
        setWatchlist(prevWatchlist => {
            const newWatchlist = [...prevWatchlist]; // Create a copy of the previous state array
            newWatchlist[index] = { ...newWatchlist[index], checked: !newWatchlist[index].checked }; // Update the checked property
            return newWatchlist; // Return the updated array to update state
        });
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
                    {watchlist?.map((list, index) => (
                        <Button key={index} onClick={() => handleButtonClick(index)}>{list.name}
                            <Checkbox {...label} checked={list.checked} onChange={(event) => handleCheckboxChange(event, index)}/>
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