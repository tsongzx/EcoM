import React, { useState } from "react";
import Modal from '@mui/material/Modal';
import { Button, Typography } from "@mui/material";

const WatchlistModal = ({ isOpen, handleClose }) => {
    const [watchlist, setWatchist] = useState([]); //this should be populated with whatever lists the user has via backend
    const [listName, setListName] = useState(false);
    const [newWatchlistName, setNewWatchlistName] = useState('');

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
        setListName(false);
        
        console.log('creating new watchlist called ', newWatchlistName);
        setWatchist([...watchlist, newWatchlistName]);
        setNewWatchlistName('');

        //append the new name to the watchlists, add the new watchlist as containing the current company too
        
        //Apply the updates to the backend 
    }

    // Handle adding to a watchlist

    // Handle removing from a watchlist

    //Add event Listener for 'esc' key that cancels listName or CLoses modal depending on whether listname is open
    const handleKeyPressEsc = (event) => {
        if (event.key === 'Esc') {
            if (listName && event.key === 'Esc') {
                //close listname
                setListName(false);
            } else {
                setNewWatchlistName('');
                handleClose();
            }
        }
    }

    //Add Event Listener for 'enter' key that submits information if the listName is open
    const handleKeyPressEnter = (event) => {
        if (listName && event.key === 'Enter') {
            handleAddNewWatchlist();
        }
      };


    const CloseWatchListModal = () => {
        setNewWatchlistName('');
    }
    // also need to apply padding on the bottom of the Modal so that the stick new watchlist doesn't conflict with it
    // if untitled, either throw error or set as untitled
    return (
        <Modal 
            open = {isOpen}>
            <Typography variant="body2">Add to watchlist</Typography>
            {/* Render exisitng watchlists */}
            {watchlist?.map((list) => (
                <Button>{list} <Checkbox
                {...label}
                icon={<BookmarkBorderIcon />}
                checkedIcon={<BookmarkIcon />}
              /></Button>
            ))}
            <div>
                {listName ?
                (<Box sx={{ display: 'flex', alignItems: 'center'}}>
                    <TextField fullWidth id="standard-basic" label="new watchlist name" variant="standard" defaultValue={newWatchlistName} onChange={handleNewWatchListName} onKeyPress = {handleKeyPressEnter}/>
                    <Button variant="outlined" onClick={handleAddNewWatchlist}>OK</Button>
                </Box>) 
                : (<Button onClick={handleListName}>+ New WatchList</Button>)
                };
            </div>
        </Modal>
    );
};

export default WatchlistModal;