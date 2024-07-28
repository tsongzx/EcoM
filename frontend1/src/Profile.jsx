import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
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
    const [updatedConfirmPassword, setUpdatedConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');

    const token = Cookies.get('authToken');

    // const nameInput = document.getElementById('pfpName');
    // const oldPInput = document.getElementById('pfpOPass');
    // const newPInput = document.getElementById('pfpNPass');
    // const conPInput = document.getElementById('pfpCPass');

    //Get user Information on mount
    useEffect(() => {
        const setData = async() => {
          const userInfo = await getUserInfo();
          console.log('userINFO inside INIT USE EFFECT', userInfo);
          console.log(`got user information ${userInfo.name}, ${userInfo.password}`);
          setName(userInfo.full_name);
          setUpdatedName(userInfo.full_name);
          setEmail(userInfo.email);
        }
        setData();
    },[]);

    const getUserInfo = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/user', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(`fetched user's information ${response.data.user}`);
            console.log(response.data.email);
            return response.data;
        } catch (error) {
            console.log('error getting user information ',error);
        }
    }
    // 0) It could be passed in a URL such that the return key 
    // will navigate the user back to where they left off

    // 1) get User and Display data

    // 2) Update the User's password (include confirm password)
    const handleUpdatePassword = () => {
        //check password is different to the old one
        console.log('handing updated password...');
        console.log(`old: ${password}, new: ${updatePassword}, confirmed: ${updatedConfirmPassword}`);
        if (password === '') {
            setShowUpdatePassword(false);
        }
        else if (updatedPassword === password) {
            setErrorMessage('Cannot use previous password');
        }
        else if (!(updatedPassword === updatedConfirmPassword)) {
            setErrorMessage('Passwords do not match');
        }
        else if (updatedPassword.length < 8) {
            setErrorMessage('Password has to be greater than 8 characters');
        }
        else {
            //push changes to backend
            updatePassword(password, updatedPassword, updatedConfirmPassword);
            setShowUpdatePassword(false);
        }
        //reset password values
        setPassword('');
        setUpdatedPassword('');
        setUpdatedConfirmPassword('');
        return;
    }

    const updatePassword = async (old, newP, newConfirmed) => {
        try {
            const response = await axios.put('http://127.0.0.1:8000/user/password', {
                old_password: old,
                new_password: newP,
                confirm_password: newConfirmed
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            setErrorMessage('');
            return response.data;
        } catch (error) {
            console.log(error);
            setErrorMessage('There was an oopsie updating password:', error);
        }
    }

    // 3) Update the User's name
    const handleCloseUpdateName = () => {
        console.log(`updating name ${name} to ${updatedName}`);
        if (name === updatedName || updatedName.length === 0) {
            return;
        }
        setShowUpdateName(false);
        setName(updatedName);

        //push changes to backend
        updateName(updatedName);
    }

    const updateName = async (name) => {
        console.log(`Updating name to: ${name}`);
        try {
            const response = await axios.put(`http://127.0.0.1:8000/user/full-name`, {
                new_name: name
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('updateName to PUT: http://127.0.0.1:8000/user/full-name ran successfully', response.data);
            setErrorMessage('');
        } catch (error) {
            console.log(error);
        }
    }

    // 4) When the user presses enter or esc, it exits a text box or submits
    const handleKeyPressEnter = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            //submit 
        }
    }

    const handleKeyPressEsc = (event) => {
        if (event.key === 'Escape' || event.keyCode === 27) {
            
        } 
    }
    // 5) User can Choose the theme too
    return (
        <div className="profilePage">
            {showUpdateName 
                ? (<div>
                    <input id="pfpName" defaultValue={name} onChange={(event) => {setUpdatedName(event.target.value)}}/>
                    <button onClick={handleCloseUpdateName}>OK</button>
                </div>) 
                : (<div>
                    <p>{name}</p>
                    <button onClick={() => {setShowUpdateName(true)}}>edit</button>
                </div>)}
                {showUpdatePassword 
                ? (<div>
                    <input id="pfpOPass" type="password" placeholder="old password" onChange={(event) => {setPassword(event.target.value)}}/>
                    <input id="pfpNPass" type="password" placeholder="new password" onChange={(event) => {setUpdatedPassword(event.target.value)}}/>
                    <input id="pfpCPass" type="password" placeholder="confirm password" onChange={(event) => {setUpdatedConfirmPassword(event.target.value)}}/>
                    <button onClick={handleUpdatePassword}>OK</button>
                </div>) 
                : (<div>
                    <button onClick={() => {setShowUpdatePassword(true)}}>Update Password</button>
                </div>)}
                <p>{email}</p>
                <p>{errorMessage}</p>
                <div className="profilePageLists">

                </div>
        </div>
    )
}

export default Profile;