import React, { useEffect } from 'react'
import './home.css'
import '../../component/common.css'
import { GigCard } from '../GigCard/GigCard'
import { useDispatch, useSelector } from 'react-redux'
import { getAllGig } from '../../actions/gigAction'

import { Sidebar } from '../Sidebar/Sidebar';
import { Header } from '../Header/Header'
import { Navigate } from 'react-router-dom'


export const Home = () => {
    const dispatch = useDispatch();

    const { loading, error, gigs, gigsCount } = useSelector(state => state.gigs);
    // console.log(gigs);

    useEffect(() => {
        dispatch(getAllGig());
    }, [dispatch])
    

    return (
        <>
            <div className='all-gigs-container'>
                {
                    gigs && gigs.map(gig => (
                        <GigCard gig={gig} key={gig._id} />
                    ))
                }
            </div>
        </>
    )
}
