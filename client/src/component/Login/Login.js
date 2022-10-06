import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { loggedUser } from '../../actions/userAction';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const {user, loading, isAuthenticated} = useSelector(state => state.loggedUser);


    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        dispatch(loggedUser(loginEmail, loginPassword));
    }

    useEffect(() => {
        if(user){
            navigate(-1);
        }
    }, [user, dispatch])
    


    

    return (
        <>
            <h1>Login</h1>
            <form onSubmit={e => handleLoginSubmit(e)}>
                <input onChange={e => setLoginEmail(e.target.value)} placeholder='Email' value={loginEmail}></input>
                <input onChange={e => setLoginPassword(e.target.value)} placeholder='Password' value={loginPassword}></input>
                <button type='submit'>Submit</button>
            </form>
        </>
    )
}
