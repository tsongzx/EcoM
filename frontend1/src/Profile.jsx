import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Input from '@mui/joy/Input';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/joy/Button';
import pfp from './assets/default_pfp.jpg';
import SelfExpiringMessage from "./assets/SelfExpiringMessage";
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
    const [fontSize, setFontSize] = useState('1.5em');
    const token = Cookies.get('authToken');
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');

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

    useEffect(() => {
        if (name.length < 10) {
            setFontSize('2em');
        } 
        else if (name.length < 15) {
            setFontSize('1.5em');
        } else {
            setFontSize('1.1em');
        }
    }, [name]);

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
            console.log('No Password Inputted');
            setShowUpdatePassword(false);
            setErrorMessage('');
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
            setMessage('Successfully Updated Password');
            setShowMessage(true);
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
            console.log('SUCCESSFULLY UPDATED PASSWORD');
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

    const handleShowPassword = () => {
        setShowUpdatePassword(!showUpdatePassword);
        setShowUpdateName(false);
    }

    const handleShowName = () => {
        setShowUpdatePassword(false);
        setShowUpdateName(!showUpdateName);
    }
    // 5) User can Choose the theme too
    return (
        <div className="profilePage">
            <img className='profilepfp-image' src={pfp} alt='Some people'/>
            {showUpdateName 
                ? (<div className="pfpName-container">
                    <Input id="pfpName" defaultValue={name} onChange={(event) => {setUpdatedName(event.target.value)}}/>
                    <span>
                        <Button onClick={() => setShowUpdateName(false)} size="sm" variant="plain"><CloseIcon/></Button>
                        <Button onClick={handleCloseUpdateName} size="sm" variant="plain"><DoneIcon/></Button>
                    </span>
                </div>) 
                : (<div className="pfpName-display">
                    <h1 style={{fontSize: fontSize}}>{name}</h1>
                    <Button onClick={handleShowName} size="sm" variant="outlined">edit</Button>
                </div>)}
                {showUpdatePassword 
                ? (<div className="pfp-password-container">
                    <Input id="pfpOPass" type="password" placeholder="old password" onChange={(event) => {setPassword(event.target.value)}}/>
                    <Input id="pfpNPass" type="password" placeholder="new password" onChange={(event) => {setUpdatedPassword(event.target.value)}}/>
                    <Input id="pfpCPass" type="password" placeholder="confirm password" onChange={(event) => {setUpdatedConfirmPassword(event.target.value)}}/>
                    <span>
                        <Button onClick={() => setShowUpdatePassword(false)} size="sm" variant="plain"><CloseIcon/></Button>
                        <Button onClick={handleUpdatePassword} size="sm" variant="plain"><DoneIcon/></Button>
                    </span>
                </div>) 
                : (<div>
                    <Button onClick={handleShowPassword} size="sm" variant="outlined">Update Password</Button>
                </div>)}
                <p>{email}</p>
                <p>{errorMessage}</p>
                <div className="profilePageLists">

                </div>
                {showMessage && <SelfExpiringMessage message={message} onExpiry={() => setShowMessage(false)}/>}
        </div>
    )
}

export default Profile;