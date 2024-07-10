import React, { useState } from "react";
/**
 * 
 */
const Profile = () => {
    const [showUpdateName, setShowUpdateName] = useState(false);
    const [showUpdatePassword, setShowUpdatePassword] = useState(false);
    const [name, setName] = useState('');
    const [updatedName, setUpdatedName] = useState('');
    const [password, setPassword] = useState('');
    //updated versions are just to keep the old passwords
    const [updatedPassword, setUpdatedPassword] = useState('');
    // 0) It could be passed in a URL such that the return key 
    // will navigate the user back to where they left off

    // 1) get User and Display data

    // 2) Update the User's password (include confirm password)

    // 3) Update the User's name
    const handleCloseUpdateName = () => {
        setShowUpdateName(false);
        setName(updatedName);
        //push changes to backend
    }

    // 4) When the user presses enter or esc, it exits a text box or submits

    // 5) User can Choose the theme too
    return (
        <div className="profilePage">
            {showUpdateName 
                ? (<div>
                    <input defaultValue={name} onChange={(event) => {setUpdatedName(event.target.value)}}/>
                    <button onClick={handleCloseUpdateName}>OK</button>
                </div>) 
                : (<div>
                    <p>{name}</p>
                    <button onClick={() => {setShowUpdateName(true)}}>edit</button>
                </div>)}
        </div>
    )
}

export default Profile;