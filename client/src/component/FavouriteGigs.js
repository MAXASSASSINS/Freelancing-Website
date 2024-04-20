import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFavoriteGigs } from "../actions/gigAction";
import { useNavigate } from "react-router-dom";
import { GigCard } from "./GigCard/GigCard";
import { loggedUser } from "../actions/userAction";
import { SearchTagsBar } from "./SearchTagsBar";

export const FavouriteGigs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.user);

  let { gigLoading, userError, gigs, gigsCount } = useSelector(
    (state) => state.gigs
  );

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
          if (entry.target.attributes.getNamedItem("poster")) {
            entry.target.attributes.getNamedItem("poster").value =
              entry.target.attributes.getNamedItem("data-poster").value;
          } else {
            entry.target.attributes.getNamedItem("src").value =
              entry.target.attributes.getNamedItem("data-src").value;
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
      <h1 className="all-gigs-container text-2xl font-semibold text-dark_grey underline pt-4 pb-0">Favourite Gigs</h1>
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
