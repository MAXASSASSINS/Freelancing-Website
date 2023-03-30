import React, { useState } from 'react';
// eslint-disable-next-line
import Carousel from 'react-bootstrap/Carousel';
import './myCarousel.css'
import { IoMdImages } from 'react-icons/io';

export const MyCarousel = ({ gig }) => {
    const [arrows, setArrows] = useState(false);
    
    const showArrows = () => {
        setArrows(true);
    }

    const hideArrows = () => {
        setArrows(false);
    }


    return (
        <div className='slides-preview' onMouseEnter={showArrows} onMouseLeave={hideArrows}>
            {
                gig && gig.images.length === 0 ?
                    <div className='no-images-container'>
                        <IoMdImages className='no-images-icon'></IoMdImages>
                    </div>
                    :
                    <Carousel interval={null} touch={true} indicators={false} controls={arrows}>
                        {
                            gig.images.map(image => (
                                image && 
                                <Carousel.Item key={image._id}>
                                    <img className='carousel-img' src={image.imgUrl} alt={gig.title} ></img>
                                </Carousel.Item>
                            ))
                        }
                    </Carousel>
            }
        </div>
    );
}
