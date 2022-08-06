import React, { useEffect } from 'react'
import './home.css'
import '../../component/common.css'
import { GigCard } from '../GigCard/GigCard'
import { useDispatch, useSelector } from 'react-redux'
import { getAllGig } from '../../actions/gigAction'

import { Sidebar } from '../Sidebar/Sidebar';
import { Header } from '../Header/Header'
// const gig = {
//     title: "I will create a beautiful vector landscape illustration",
//     userName: "saba_parveen",
//     ratings: 5.0,
//     numOfReviews: 1,
//     price: 1244,
//     profilePic: "https://fiverr-res.cloudinary.com/t_profile_original,q_auto,f_auto/attachments/profile/photo/6f7ea747e554c953fa392a5071def2a8-1648204854641/0c9f8abb-41b1-458a-8ea8-67560d465c85.png",
//     images: [
//         "https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/249563036/original/f5162238e38a702283d28dfe17a1780d428492cd/create-vector-beautiful-landscape-illustration.png",
//         "https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs2/249563036/original/c0fa3c2767c4090b06a5198ca8e82443a635754a/create-vector-beautiful-landscape-illustration.png",
//         "https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs3/249563036/original/934491d37c9a588932576c075a9667c58ab0c3d1/create-vector-beautiful-landscape-illustration.png"
//     ]
// }

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
