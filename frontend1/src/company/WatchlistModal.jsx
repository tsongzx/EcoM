import React, { useState } from "react";
import Modal from '@mui/material/Modal';
import { Button, Typography } from "@mui/material";

const WatchlistModal = ({ isOpen }) => {
    const [watchlist, setWatchist] = useState([]); //this should be populated with whatever lists the user has 
    const [listName, setListName] = useState(false);

    const handleListName = () => {
        setListName(true);
    }

    const handleNewWatchlist = () => {
        
    }

    return (
        <Modal 
            open = {isOpen}>
            <Typography variant="body2">Add to watchlist</Typography>
            <div>
                {listName ?
                (<Box sx={{ display: 'flex', alignItems: 'center'}}>
                    <TextField fullWidth id="standard-basic" label="new watchlist name" variant="standard"/>
                    <Button variant="outlined">OK</Button>
                </Box>) 
                : (<Button onClick={handleListName}>+ New WatchList</Button>)
                };
            </div>
        </Modal>
    );
};

export default WatchlistModal;