import React, { useState, useEffect, useRef, useContext } from "react";
import "./gigDetail.css";
import { GigCard } from "../GigCard/GigCard";
import { useDispatch, useSelector } from "react-redux";
import { getGigDetail, getUserGigs } from "../../actions/gigAction";
import { Link, useNavigate, useParams } from "react-router-dom";
import { flags } from "../../data/country-flags";
import Moment from "react-moment";
import "moment-timezone";
import { RatingStars } from "../RatingStars/RatingStars";
import { MyCarousel } from "../Carousel/MyCarousel";
import { RatingBars } from "../RatingBars/RatingBars";
import { Chat } from "../Chat/Chat";
import { ToastContainer, toast } from "react-toastify";
import CreateIcon from "@mui/icons-material/Create";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import { TextEditor } from "../TextEditor/TextEditor";
import { Avatar } from "../Avatar/Avatar";
import { FaCheck, FaRegClock } from "react-icons/fa";
import { FiRepeat } from "react-icons/fi";
import { BsCheck } from "react-icons/bs";
import { HiStar } from "react-icons/hi";

export const GigDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const styleMap = {
    HIGHLIGHT: {
      backgroundColor: "yellow",
    },
  };

  let [gigReviews, setGigReviews] = useState(null);
  const [reviewCount, setReviewCount] = useState(5);
  let [arr, setArr] = useState([0, 0, 0, 0, 0]);
  const [pricePackageInfo, setPricePackageInfo] = useState(null);
  const [currentlySelectedPackageNumber, setCurrentlySelectedPackageNumber] =
    useState(0);
  const [showChatBox, setShowChatBox] = useState(false);

  useEffect(() => {
    dispatch(getGigDetail(params.id));
  }, [dispatch, params.id]);

  const { gigDetail } = useSelector((state) => state.gigDetail);
  const { user, userLoading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    // 
    setGigReviews(gigDetail && gigDetail.reviews);
    setPricePackageInfo(gigDetail && gigDetail.pricing[0]);

    // setting editor state
    const description = gigDetail && gigDetail.description;
    // 
    if (!description) return;
    let contentState = convertFromRaw(JSON.parse(description));
    let editorState = EditorState.createWithContent(contentState);
    setEditorState(editorState);
  }, [gigDetail]);

  const getFlag = (flagName) =>
    flags.find((flag) => {
      if (flag.name === flagName) {
        return flag;
      }
      return null;
    });

  const increaseReviewCount = () => {
    setReviewCount((prev) => prev + 5);
  };

  const reviewCountAccoridingToRating = (rating) => {
    arr = [0, 0, 0, 0, 0];
    gigDetail.reviews.map((review) => {
      return ++arr[review.rating - 1];
    });
    if (rating == -1) {
      return -1;
    }
    return arr[rating - 1];
  };

  gigDetail && reviewCountAccoridingToRating(-1);

  const handleClickOnRating = (rating) => () => {
    setReviewCount(5);
    const selectedRating = document.getElementById("rating-" + rating);
    const classList = selectedRating.classList;
    if (selectedRating.classList.contains("gig-review-rating-selected")) {
      setGigReviews(gigDetail.reviews);
      classList.remove("gig-review-rating-selected");
    } else {
      getReviewsOnSelectedRating(rating);
      ratingSelected(rating);
    }
  };

  const getReviewsOnSelectedRating = (rating) => {
    const temp = gigDetail.reviews.filter((review) => review.rating === rating);
    setGigReviews(temp);
  };

  const ratingSelected = (rating) => {
    document
      .getElementById("rating-" + 5)
      .classList.remove("gig-review-rating-selected");
    document
      .getElementById("rating-" + 4)
      .classList.remove("gig-review-rating-selected");
    document
      .getElementById("rating-" + 3)
      .classList.remove("gig-review-rating-selected");
    document
      .getElementById("rating-" + 2)
      .classList.remove("gig-review-rating-selected");
    document
      .getElementById("rating-" + 1)
      .classList.remove("gig-review-rating-selected");
    document
      .getElementById("rating-" + rating)
      .classList.add("gig-review-rating-selected");
  };

  // 
  const handlePricePackageSelection = (e) => {
    if (e.target.classList.contains("price-package-selected")) {
      return;
    } else {
      const parent = e.target.parentElement;
      const children = parent.children;
      var index = Array.prototype.indexOf.call(children, e.target);
      setCurrentlySelectedPackageNumber(index);
      for (let i = 0; i < children.length; i++) {
        children[i].classList.remove("price-package-selected");
      }
      e.target.classList.add("price-package-selected");
      setPricePackageInfo(gigDetail.pricing[index]);
    }
  };

  const checkUserOpenItsOwnGig = () => {
    if (user && gigDetail) {
      if (user._id === gigDetail.user._id) {
        return true;
      }
      return false;
    }
    return false;
  };

  useEffect(() => {
    checkUserOpenItsOwnGig();
  }, [user]);

  const handleContinueBuyClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (checkUserOpenItsOwnGig())
      return toast.error("You can not buy your own gig");
    // 
    navigate(
      `/gig/place/order/${gigDetail._id}/${currentlySelectedPackageNumber}`
    );
  };

  return (
    gigDetail && (
      <>
        {showChatBox && (
          <Chat
            gigDetail={gigDetail}
            showChatBox={showChatBox}
            setShowChatBox={setShowChatBox}
          ></Chat>
        )}
        <div className="gig-detail-main-wrapper">
          <section className="gig-details-section">
            <div>
              {checkUserOpenItsOwnGig() && (
                <Link
                  to={{
                    pathname: "/gig/create/new/gig",
                    search: `?id=${gigDetail._id}`,
                  }}
                  className="user-detail-edit-gig"
                >
                  <div className="edit-icon">
                    <CreateIcon></CreateIcon>
                  </div>
                  <div>Edit Gig</div>
                </Link>
              )}
            </div>
            <div className="gig-details-gig-overveiw">
              <h1 className="gig-details-gig-title">{gigDetail.title}</h1>
              <div className="gig-seller-overview">
                <Avatar
                  avatarUrl={gigDetail.user.avatar.url}
                  userName={gigDetail.user.name}
                  width="1.875rem"
                  alt={gigDetail.user.name}
                  fontSize="1rem"
                />

                <a href="#gig-owner-details-id">
                  <div className="gig-seller-overview-seller-name">
                    {gigDetail.user.name}
                  </div>
                </a>
                <a href="#review-container">
                  <RatingStars rating={gigDetail.ratings}></RatingStars>
                </a>
                <div>{gigDetail.ratings.toFixed(1)}</div>
                <div>({gigDetail.numOfRatings})</div>
              </div>
            </div>
            <div className="gig-details-carousel">
              <MyCarousel lazyLoad={false} gig={gigDetail}></MyCarousel>
            </div>
            <section className="price-section small-screen">
              <nav className="price-navigation">
                <ul>
                  <li
                    onClick={handlePricePackageSelection}
                    className="price-package-selected"
                  >
                    Basic
                  </li>
                  <li onClick={handlePricePackageSelection}>Standard</li>
                  <li onClick={handlePricePackageSelection}>Premium</li>
                </ul>
              </nav>
              {pricePackageInfo && (
                <div className="price-section-details">
                  <header>
                    <h3>
                      <div className="price-package-title">
                        {pricePackageInfo.packageTitle}
                      </div>
                      <div className="price-package-price">
                        ₹{Number(pricePackageInfo.packagePrice).toFixed(2)}
                      </div>
                    </h3>
                    <p>{pricePackageInfo.packageDescription}</p>
                  </header>
                  <div className="delivery-revision-div">
                    <div className="package-delivery">
                      <FaRegClock />
                      <p>{pricePackageInfo.packageDeliveryTime}</p>
                    </div>
                    <div className="package-revisions">
                      <FiRepeat />
                      <p>{pricePackageInfo.revisions}</p>
                    </div>
                  </div>
                  <div className="package-output">
                    <ul>
                      <li
                        className={
                          pricePackageInfo.sourceFile === true
                            ? "package-output-selected"
                            : undefined
                        }
                      >
                        <FaCheck className="inline" />
                        Source File
                      </li>
                      <li
                        className={
                          pricePackageInfo.commercialUse === true
                            ? "package-output-selected"
                            : undefined
                        }
                      >
                        <FaCheck className="inline" />
                        Commercial Use
                      </li>
                    </ul>
                  </div>
                  <footer>
                    <button onClick={handleContinueBuyClick}>
                      Continue (₹{pricePackageInfo.packagePrice})
                    </button>
                  </footer>
                </div>
              )}
              <div
                onClick={() => setShowChatBox(true)}
                className="price-section-contact-me-button"
              >
                <button>Contact Seller</button>
              </div>
            </section>
            <div className="gig-details-description-div">
              <header>
                <h2>About This Gig</h2>
              </header>
              {/* <div className='gig-details-description-wrapper' dangerouslySetInnerHTML={{ __html: gigDetail.description }}>
            </div> */}
              <div className="gig-details-description-wrapper">
                <Editor
                  editorState={editorState}
                  readOnly={true}
                  customStyleMap={styleMap}
                  toolbarHidden={true}
                  customStyleFn={() => {
                    return {
                      lineHeight: 1.5,
                      fontSize: "1rem",
                    };
                  }}
                />
              </div>
            </div>
            <div id="gig-owner-details-id" className="gig-owner-details-div">
              <header>
                <h2>About The Seller</h2>
              </header>
              <div className="gig-owner-profile-info-wrapper">
                <Avatar
                  avatarUrl={gigDetail.user.avatar.url}
                  userName={gigDetail.user.name}
                  width="3rem"
                  alt={gigDetail.user.name}
                  fontSize="1.5rem"
                />
                {/* <img src={gigDetail.user.avatar.url}></img> */}
                <div className="gig-owner-profile-info">
                  <Link to={`/user/${gigDetail.user._id}`}>
                    <div className="gig-owner-name">{gigDetail.user.name}</div>
                  </Link>
                  <div className="gig-owner-tagline">
                    {gigDetail.user.tagline}
                  </div>
                  <div className="gig-owner-rating-div">
                    <div>
                      <RatingStars
                        rating={gigDetail.user.ratings}
                      ></RatingStars>
                    </div>
                    &nbsp;
                    <div className="gig-owner-rating">
                      {gigDetail.user.ratings.toFixed(1)}
                    </div>
                    &nbsp;
                    <div>({gigDetail.user.numOfRatings})</div>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowChatBox(true)}>Contact Me</button>
              <div className="gig-onwer-stats-description">
                <div className="gig-owner-stats">
                  <ul>
                    <li>
                      From
                      <div>{gigDetail.user.country}</div>
                    </li>
                    <li>
                      Member since
                      <div>
                        <Moment format="MMM YYYY">
                          {gigDetail.user.userSince}
                        </Moment>
                      </div>
                    </li>
                    <li>
                      Last delivery
                      <div>
                        {gigDetail.user.lastDelivery ? (
                          <Moment fromNow>{gigDetail.user.lastDelivery}</Moment>
                        ) : (
                          "---"
                        )}
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="gig-owner-decription">
                  {gigDetail.user.description}
                </div>
              </div>
            </div>
            <div id="review-container" className="gig-review-list-cotainer">
              <div className="user-detail-review-list-container">
                <div className="user-detail-review-list">
                  <h2>
                    <span className="gig-detail-gig-review-count">
                      {gigDetail.numOfReviews} Reviews
                    </span>
                    &nbsp; &nbsp;
                    <div className="user-detail-review-rating-stars">
                      <HiStar />
                      <RatingStars rating={gigDetail.ratings}></RatingStars>
                    </div>
                    &nbsp; &nbsp;
                    <span className="user-detail-gig-rating">
                      {gigDetail.ratings.toFixed(1)}
                    </span>
                  </h2>
                  <div className="gig-review-rating-wise-division-wrapper">
                    <ul>
                      <li onClick={handleClickOnRating(5)}>
                        <span id="rating-5" className="rating-number">
                          5 Stars
                        </span>
                        <RatingBars
                          rating={arr[4] / gigDetail.numOfRatings}
                        ></RatingBars>
                        <span>({arr[4]})</span>
                      </li>
                      <li onClick={handleClickOnRating(4)}>
                        <span id="rating-4" className="rating-number">
                          4 Stars
                        </span>
                        <RatingBars
                          rating={arr[3] / gigDetail.numOfRatings}
                        ></RatingBars>
                        <span>({arr[3]})</span>
                      </li>
                      <li onClick={handleClickOnRating(3)}>
                        <span id="rating-3" className="rating-number">
                          3 Stars
                        </span>
                        <RatingBars
                          rating={arr[2] / gigDetail.numOfRatings}
                        ></RatingBars>
                        <span>({arr[2]})</span>
                      </li>
                      <li onClick={handleClickOnRating(2)}>
                        <span id="rating-2" className="rating-number">
                          2 Stars
                        </span>
                        <RatingBars
                          rating={arr[1] / gigDetail.numOfRatings}
                        ></RatingBars>
                        <span>({arr[1]})</span>
                      </li>
                      <li onClick={handleClickOnRating(1)}>
                        <span id="rating-1" className="rating-number">
                          1 Star
                        </span>
                        <RatingBars
                          rating={arr[0] / gigDetail.numOfRatings}
                        ></RatingBars>
                        <span>({arr[0]})</span>
                      </li>
                    </ul>
                  </div>
                  {gigReviews &&
                    gigReviews.map((review, index) => {
                      return (
                        index < reviewCount && (
                          <div className="user-detail-review" key={index}>
                            <div className="user-detail-review-customer">
                              <div className="user-detail-review-customer-img">
                                <Avatar
                                  avatarUrl={review.avatar.url}
                                  userName={review.name}
                                  width="2rem"
                                  alt={review.name}
                                  fontSize="1rem"
                                />
                              </div>
                              <div className="user-detail-review-customer-name">
                                {review.name}
                              </div>
                              <RatingStars rating={review.rating}></RatingStars>
                              <div>{review.rating}</div>
                            </div>
                            <div className="user-detail-review-customer-country">
                              <img
                                src={getFlag("India").image}
                                alt="country flag"
                              ></img>
                              <div>{review.country}</div>
                            </div>
                            <p className="user-detail-review-paragraph">
                              {review.comment}
                            </p>
                            <p className="user-detail-review-publish">
                              Published &nbsp;
                              <span>
                                <Moment fromNow={true}>
                                  {review.createdAt}
                                </Moment>
                              </span>
                            </p>
                          </div>
                        )
                      );
                    })}
                  {gigReviews?.length > reviewCount && (
                    <div
                      className="user-review-see-more"
                      onClick={increaseReviewCount}
                    >
                      + See more
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section
            id="price-section-large"
            className="price-section large-screen"
          >
            <nav className="price-navigation">
              <ul>
                <li
                  onClick={handlePricePackageSelection}
                  className="price-package-selected"
                >
                  Basic
                </li>
                <li onClick={handlePricePackageSelection}>Standard</li>
                <li onClick={handlePricePackageSelection}>Premium</li>
              </ul>
            </nav>
            {pricePackageInfo && (
              <div className="price-section-details">
                <header>
                  <h3>
                    <div className="price-package-title">
                      {pricePackageInfo.packageTitle}
                    </div>
                    <div className="price-package-price">
                      ₹{Number(pricePackageInfo.packagePrice).toFixed(2)}
                    </div>
                  </h3>
                  <p>{pricePackageInfo.packageDescription}</p>
                </header>
                <div className="delivery-revision-div">
                  <div className="package-delivery">
                    <FaRegClock />
                    <p>{pricePackageInfo.packageDeliveryTime}</p>
                  </div>
                  <div className="package-revisions">
                    <FiRepeat />
                    <p>{pricePackageInfo.revisions}</p>
                  </div>
                </div>
                <div className="package-output">
                  <ul>
                    <li
                      className={
                        pricePackageInfo.sourceFile && "package-output-selected"
                      }
                    >
                      <FaCheck className="inline" />
                      Source File
                    </li>
                    <li
                      className={
                        pricePackageInfo.commercialUse &&
                        "package-output-selected"
                      }
                    >
                      <FaCheck className="inline" />
                      Commercial Use
                    </li>
                  </ul>
                </div>
                <footer>
                  <button onClick={handleContinueBuyClick}>
                    Continue (₹{pricePackageInfo.packagePrice})
                  </button>
                </footer>
              </div>
            )}
            <div className="price-section-contact-me-button">
              <button onClick={() => setShowChatBox(true)}>
                Contact Seller
              </button>
            </div>
          </section>
        </div>
      </>
    )
  );
};
