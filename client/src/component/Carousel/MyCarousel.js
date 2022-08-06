import React, { useState} from 'react';
// eslint-disable-next-line
import Carousel from 'react-bootstrap/Carousel';
import './myCarousel.css'


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
                <Carousel interval={null} touch={true} indicators={false} controls={arrows}>
                    {
                        gig && gig.images.map(image => (
                            <Carousel.Item key={image._id}>
                                <img src={image.imgUrl} alt={gig.title} ></img>
                            </Carousel.Item>
                        ))
                    }

                    
                    {/* <Carousel.Item>
                        <img src="../images/img1.jpeg" alt="gig image"></img>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src="../images/img2.webp" alt="gig image"></img>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img src="../images/img3.jpeg" alt="gig image"></img>
                    </Carousel.Item> */}
                </Carousel>
            }
        </div>
    );
}
