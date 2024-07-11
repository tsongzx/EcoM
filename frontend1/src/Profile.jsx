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

    //Get user Information on mount
    useEffect(() => {
        const userInfo = getUserInfo();
        setName(userInfo.full_name);
        setPassword(userInfo.password);
        setEmail(userInfo.email);
    },[]);

    const getUserInfo = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/user', {
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data.user;
        } catch (error) {
            console.log(error);
        }
    }
    // 0) It could be passed in a URL such that the return key 
    // will navigate the user back to where they left off

    // 1) get User and Display data

    // 2) Update the User's password (include confirm password)
    const handleUpdatePassword = () => {
        //check password is different to the old one
        if (updatedPassword === password) {
            setErrorMessage('Cannot use previous password');
            setUpdatedPassword('');
            setUpdatedConfirmPassword('');
            return;
        }
        if (!(updatedPassword === updatedConfirmPassword)) {
            setErrorMessage('Passwords do not match');
            setUpdatedPassword('');
            setUpdatedConfirmPassword('');
            return;
        }
        if (updatedPassword.length < 8) {
            setErrorMessage('Password has to be greater than 8 characters');
            setUpdatedPassword('');
            setUpdatedConfirmPassword('');
            return;
        }
        //push changes to backend
        updatePassword(password, updatedPassword, updatedConfirmPassword);
        //reset password values
        setPassword(updatedPassword);
        setUpdatedPassword('');
        setUpdatedConfirmPassword('');
        showUpdatePassword(false);
    }

    const updatePassword = async (old, newP, newConfirmed) => {
        try {
            const response = await axios.put('http://127.0.0.1:8000/user/full-name', {
                old_password: old,
                new_password: newP,
                confirm_password: newConfirmed
            }, {
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
            setErrorMessage('There was an oopsie:', error);
        }
    }

    // 3) Update the User's name
    const handleCloseUpdateName = () => {
        if (name === updatedName) {
            return;
        }
        setShowUpdateName(false);
        setName(updatedName);

        //push changes to backend
        updateName(name);
    }

    const updateName = async (name) => {
        try {
            const response = await axios.put('http://127.0.0.1:8000/user/full-name', {
                new_name: name
            }, {
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.log(error);
        }
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
                {showUpdatePassword 
                ? (<div>
                    <input type="password" onChange={(event) => {setUpdatedPassword(event.target.value)}}/>
                    <input type="password" onChange={(event) => {setUpdatedConfirmPassword(event.target.value)}}/>
                    <button onClick={handleUpdatePassword}>OK</button>
                </div>) 
                : (<div>
                    <input type={password} defaultValue={password} readOnly/>
                    <button onClick={() => {setShowUpdatePassword(true)}}>edit</button>
                </div>)}
                <p>{email}</p>
                <p>{errorMessage}</p>
                <div className="profilePageLists">

                </div>
        </div>
    )
}

export default Profile;