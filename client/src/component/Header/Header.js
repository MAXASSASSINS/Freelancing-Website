// eslint-disable-next-line
import React, { useEffect, useState } from 'react'
import '../../component/common.css'
import './header.css'
import { useSelector, useDispatch } from 'react-redux'
import { showDimBackground, hideDimBackground } from '../../actions/dimBackgroundAction';
import { getUser } from '../../actions/userAction';
import { Outlet } from 'react-router-dom';

export const Header = () => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getUser('62c4882c0648ff3db722b3da'));
    }, [dispatch])

    const show = () => {
        dispatch(showDimBackground());
    }

    const hide = () => {
        dispatch(hideDimBackground());
    }

    return (
        user && <header className='header'>
            <div className='header-container'>
                <div className='title-wrapper'>
                    <h1 className='heading'>FreelanceMe</h1>
                </div>

                <form className='form'>
                    <input className='search-input' onFocus={show} onBlur={hide} placeholder='Find services' autoComplete='off'></input>
                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                </form>

                <div className='navigation-icons'>
                    <i className="fa-regular fa-envelope inbox-icon" ></i>
                    <i className="fa-regular fa-heart my-list-icon"></i>
                    <div className='orders-icon'>Orders</div>
                    {
                        user.avatar.url ?
                            <img src={user.avatar.url} className="profile-pic" alt="user profile"></img>
                            :
                            <i className="fa-regular fa-circle-user profile-icon"></i>
                    }
                </div>
            </div>
        </header>
    )

}

