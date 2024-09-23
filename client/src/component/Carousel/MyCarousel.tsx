import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { IoMdImages } from "react-icons/io";
import { IGig } from "../../types/gig.types";
import { LazyImage } from "../LazyImage/LazyImage";
import { LazyVideo } from "../LazyVideo.js/LazyVideo";
import "./myCarousel.css";

type MyCarouselProps = {
  gig: IGig;
  lazyLoad: boolean;
};

export const MyCarousel = ({ gig, lazyLoad }: MyCarouselProps) => {
  const [arrows, setArrows] = useState<boolean>(false);

  const showArrows = () => {
    setArrows(true);
  };

  const hideArrows = () => {
    setArrows(false);
  };

  const objectFit = window.location.href.includes("/gig/details")
    ? "contain"
    : "cover";
  return (
    <div
      className="slides-preview"
      onMouseEnter={showArrows}
      onMouseLeave={hideArrows}
    >
      {gig && gig.images?.length === 0 ? (
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
          {gig.images?.map(
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
