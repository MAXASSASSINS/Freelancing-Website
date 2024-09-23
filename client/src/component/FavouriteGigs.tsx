import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getFavoriteGigs } from "../actions/gigAction";
import { AppDispatch, RootState } from "../store";
import { GigCard } from "./GigCard/GigCard";

export const FavouriteGigs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  let { gigLoading, gigs } = useSelector((state: RootState) => state.gigs);

  useEffect(() => {
    // fetch favourite gigs
    if (isAuthenticated) {
      dispatch(getFavoriteGigs());
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

  // LAZY LOADING THE IMAGES AND VIDEOS
  useEffect(() => {
    const images = document.querySelectorAll("img[data-src]");
    const videoImages = document.querySelectorAll("video[data-poster]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const posterAttr = entry.target.attributes.getNamedItem("poster");
          const dataPosterAttr =
            entry.target.attributes.getNamedItem("data-poster");
          const srcAttr = entry.target.attributes.getNamedItem("src");
          const dataSrcAttr = entry.target.attributes.getNamedItem("data-src");

          if (posterAttr && dataPosterAttr) {
            posterAttr.value = dataPosterAttr.value;
          } else if (srcAttr && dataSrcAttr) {
            srcAttr.value = dataSrcAttr.value;
          }
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "300px",
      }
    );

    images.forEach((image) => {
      observer.observe(image);
    });

    videoImages.forEach((image) => {
      observer.observe(image);
    });
  }, [gigs]);

  return (
    <div className="min-h-[calc(100vh-146.5px)] sm:min-h-[calc(100vh-81px)] mb-8">
      <h1 className="all-gigs-container text-2xl font-semibold text-dark_grey underline pt-4 pb-0">
        Favourite Gigs
      </h1>
      <div className="all-gigs-container">
        {gigs &&
          !gigLoading &&
          gigs.length > 0 &&
          gigs.map((gig) => (
            <GigCard lazyLoad={true} gig={gig} key={gig._id} />
          ))}
      </div>
    </div>
  );
};
