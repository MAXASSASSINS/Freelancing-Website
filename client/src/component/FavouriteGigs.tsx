import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getFavoriteGigs } from "../actions/gigAction";
import { AppDispatch, RootState } from "../store";
import { GigCard } from "./GigCard/GigCard";
import useLazyLoading from "../hooks/useLazyLoading";

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
  useLazyLoading({ dependencies: [gigs] });

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
