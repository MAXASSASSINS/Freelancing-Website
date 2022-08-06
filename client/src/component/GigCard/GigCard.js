import React from 'react'
import './gigCard.css'
import { MyCarousel } from '../Carousel/MyCarousel'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export const GigCard = ({ gig }) => {
    const handleClick = () => {
        console.log("clicked");
    }

    return (
        <div className='gig-card'>
            <div className='container-wrapper'>
                <Link to={`/user/${gig.user._id}`}>
                    <MyCarousel gig={gig}></MyCarousel>
                </Link>
                <div className='user-details-container'>
                    <img src={gig.user.avatar.url} alt="profile" ></img>
                    <Link to={`/user/${gig.user._id}`} onClick={handleClick}>
                        <div className='gig-user-name'>{gig.user.name}</div>
                    </Link>
                </div>
                <Link to={`/gig/details/${gig._id}`}>
                    <h2 className='gig-title'>{gig.title}</h2>
                </Link>
                <div className='ratings-container'>
                    <i className="fa-solid fa-star"></i>
                    <span className='ratings'>{gig.ratings.toFixed(1)}</span>
                    <span className='no-of-reviews'>({gig.numOfReviews})</span>
                </div>

                <div className='action-price-container'>
                    <div className='add-to-list-container'>
                        <i className="fa-solid fa-bars bars"></i>
                        <i className="fa-solid fa-heart"></i>
                    </div>
                    <Link to={`/gig/details/${gig._id}`}>
                        <div className='price-container'>
                            <div className='starting-at'>STARTING AT</div>
                            <div>₹{gig.pricing[0].packagePrice.toLocaleString('en-IN')}</div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
