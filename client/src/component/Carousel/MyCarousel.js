import React, { useState } from "react";
// eslint-disable-next-line
import Carousel from "react-bootstrap/Carousel";
import "./myCarousel.css";
import { IoMdImages } from "react-icons/io";
import { LazyImage } from "../LazyImage/LazyImage";
import { getPosterForVideo } from "../../utility/util";
import { Blurhash } from "react-blurhash";
import { LazyVideo } from "../LazyVideo.js/LazyVideo";

export const MyCarousel = ({ gig, lazyLoad }) => {
  const [arrows, setArrows] = useState(false);

  const showArrows = () => {
    setArrows(true);
  };

  const hideArrows = () => {
    setArrows(false);
  };

  const objectFit = window.location.href.includes('/gig/details') ? "contain" : "cover";
  return (
    <div
      className="slides-preview"
      onMouseEnter={showArrows}
      onMouseLeave={hideArrows}
    >
      {gig && gig.images.length === 0 ? (
        <div className="no-images-container">
          <IoMdImages className="no-images-icon"></IoMdImages>
        </div>
      ) : (
        <Carousel
          interval={null}
          touch={true}
          indicators={false}
          controls={arrows}
        >
          {gig.images.map(
            (image) =>
              image && (
                <Carousel.Item key={image._id}>
                  <LazyImage
                    file={image}
                    lazyLoad={lazyLoad}
                    aspectRatio={16 / 10}
                    objectFit={objectFit}
                  />
                </Carousel.Item>
              )
          )}

          {gig.video && (
            <Carousel.Item key={gig.video._id}>
              <LazyVideo
                file={gig.video}
                lazyLoad={lazyLoad}
                aspectRatio={16 / 10}
              />
            </Carousel.Item>
          )}
        </Carousel>
      )}
    </div>
  );
};
