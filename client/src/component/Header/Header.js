// eslint-disable-next-line
import React, { useEffect, useState } from 'react'
import '../../component/common.css'
import './header.css'
import { useSelector, useDispatch } from 'react-redux'
import { showDimBackground, hideDimBackground } from '../../actions/dimBackgroundAction';
import { getUser } from '../../actions/userAction';
import { loggedUser } from '../../actions/userAction';
import { Outlet, Navigate, Link } from 'react-router-dom';


export const Header = () => {

    const dispatch = useDispatch();
    const { user, loading, isAuthenticated } = useSelector(state => state.loggedUser);

    const [currentUser, setCurrentUser] = useState(null);

    const show = () => {
        dispatch(showDimBackground());
    }

    const hide = () => {
        dispatch(hideDimBackground());
    }


    useEffect(() => {
        setCurrentUser(user);
    }, [user])

    const [h, seth] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            seth(true);
        }, 3000);
    })

    return (
        <header className='header'>
            <div className='header-container'>
                <div className='title-wrapper'>
                    <h1 className='heading'>FreelanceMe</h1>
                </div>

                <form className='form'>
                    <input className='search-input' onFocus={show} onBlur={hide} placeholder='Find services' autoComplete='off'></input>
                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                </form>

                <div className='navigation-icons'>
                    <Link to='/get/all/messages/for/current/user'>
                        <i className="fa-regular fa-envelope inbox-icon" ></i>
                    </Link>
                    <i className="fa-regular fa-heart my-list-icon"></i>
                    <div className='orders-icon'>Orders</div>
                    {
                        !currentUser &&
                        <Link to='/login' >
                            <div>
                                <i className="fa-regular fa-circle-user profile-icon"></i>
                            </div>
                        </Link>
                    }
                    {
                        currentUser &&
                        <div>
                            {
                                currentUser.avatar.url ?
                                    <img src={currentUser.avatar.url} className="profile-pic" alt="user profile"></img>
                                    :
                                    <i className={"fa-solid profile-icon " + (currentUser ? "profile-icon-login " : " ") + "fa-" + (currentUser && currentUser.name[0].toLowerCase())}></i>
                            }
                        </div>
                    }
                </div>
            </div>
        </header>
    )

}

