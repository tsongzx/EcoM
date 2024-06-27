import React, { useState } from "react";
import Modal from '@mui/material/Modal';
import { Button, Typography, Checkbox, TextField, Box } from "@mui/material";

/**
 * Handling Watchlist modification
 * When the Modal Closes all the changes are reflected
 * @param {Array} content isOpen, handleClose and all the watchlists the user has, updates all the watchlist information
 * @returns {JSX.Element}
 */
const WatchlistModal = ({ isOpen, handleClose }) => {
    const [watchlist, setWatchlist] = useState([]); //this should be populated with whatever lists the user has via backend
    const [listName, setListName] = useState(false);
    const [newWatchlistName, setNewWatchlistName] = useState('');

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    // When someone clicks the button to add a new watchlist
    const handleListName = () => {
        setListName(true);
    }

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

        console.log('creating new watchlist called ', newWatchlistName);
        setWatchlist([...watchlist, newWatchlistName]);
        setNewWatchlistName('');
    }

    //updates the watchlists that contain the company
    const handleCheckboxChange = (event, index) => {
        console.log(`Checkbox at ${index} changed to ${event.target.checked ? 'checked' : 'unchecked'}`);
        updateCheckStatus(index);
    }

    //update the button and handle checkbox change, this would require a separate thing that keeps track of the checkboxes
    const handleButtonClick = (index) => {
        console.log(`button was clicked at index ${index}`);
        updateCheckStatus(index);
    }

    const updateCheckStatus = (index) => {
        setWatchlist(prevWatchlist => {
            const newWatchlist = [...prevWatchlist];
            newWatchlist[index].checked = !newWatchlist[index].checked;
        });
    }

    const closeWatchListModal = () => {
        setNewWatchlistName('');
        handleClose();
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
            <Typography variant="body2">Add to watchlist</Typography>
            {/* Render exisitng watchlists */}
            <div className="watchlistContainer">
                {watchlist?.map((list, index) => (
                    <Button key={index} onClick={() => handleButtonClick(index)}>{list}
                        <Checkbox {...label} onChange={(event) => handleCheckboxChange(event, index)}/>
                    </Button>
                ))}
            </div>
            <div>
                {listName ?
                (<Box sx={{ display: 'flex', alignItems: 'center'}}>
                    <TextField fullWidth id="standard-basic" label="new watchlist name" variant="standard" defaultValue={newWatchlistName} onChange={handleNewWatchListName} onKeyDown={handleEnter}/>
                    <Button variant="outlined" onClick={handleAddNewWatchlist}>OK</Button>
                </Box>) 
                : (<Button onClick={handleListName}>+ New WatchList</Button>)
                };
            </div>
        </Modal>
    );
};

export default WatchlistModal;