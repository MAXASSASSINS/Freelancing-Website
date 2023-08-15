import React, { useState, useEffect, useContext } from "react";
import "./userDetail.css";
import "../../utility/util.css";
import { GigCard } from "../GigCard/GigCard";
import { useDispatch, useSelector } from "react-redux";
import { getUserGigs } from "../../actions/gigAction";
import { getGigUser } from "../../actions/userAction";
import { Link, useNavigate, useParams } from "react-router-dom";
import { flags } from "../../data/country-flags";
import Moment from "react-moment";
import "moment-timezone";
import { RatingStars } from "../RatingStars/RatingStars";
import { ReviewList } from "../ReviewList/ReviewList";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { windowContext } from "../../App";
import { Avatar } from "../Avatar/Avatar";
import {
  FaBars,
  FaHeart,
  FaPaperPlane,
  FaRegPaperPlane,
  FaStar,
  FaUser,
} from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import { gigUserReducer } from "../../reducers/userReducers";

export const UserDetail = () => {
  const navigate = useNavigate();
  const { windowWidth, windowHeight } = useContext(windowContext);
  const params = useParams();
  const dispatch = useDispatch();

  const [reviewCount, setReviewCount] = useState(5);
  const [userReviewCount, setUserReviewCount] = useState(null);

  const { user, isAuthenticated, userLoading, userError } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(getGigUser(params.id));
    dispatch(getUserGigs(params.id));
  }, [dispatch, params.id]);

  const { user: gigUser } = useSelector((state) => state.gigUser);
  const { userGigs } = useSelector((state) => state.userGigs);

  const [active, setActive] = useState(true);

  // useEffect(() => {
  //   setUserReviewCount(() => {
  //     let count = 0;
  //     userGigs &&
  //       userGigs.map((userGig) => {
  //         count += userGig.reviews.length;
  //       });
  //     return count;
  //   });
  // }, [userGigs]);
  //
  //
  //

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

  if (isAuthenticated)
    return (
      userGigs &&
      Object.keys(gigUser).length > 0 && (
        <div className="user-details-max-width-container">
          <div className="user-info-div">
            <div className="user-info-large-screen-border first-div">
              <div className="user-info-wrapper">
                <div className="user-info-list-icon">
                  {/* <FaBars className="inline" /> */}
                  {/* <FaHeart className="inline" /> */}
                </div>
                <div className="user-detail user-profile-pic">
                  <Avatar
                    avatarUrl={gigUser.avatar.url}
                    userName={gigUser.name}
                    width={"8rem"}
                    alt={"gig profile"}
                    fontSize="3rem"
                  />
                </div>
                <div>
                  <h1 className="user-detail-user-name">{gigUser.name}</h1>
                  <p className="user-detail-tagline">{gigUser.tagline}</p>
                </div>
                <div className="user-info-review-container">
                  <RatingStars rating={gigUser.ratings}></RatingStars>
                  &nbsp; &nbsp;
                  <span>{gigUser.ratings.toFixed(1)}</span>
                  &nbsp; &nbsp;
                  <span className="user-detail-review-info">
                    ({gigUser.numOfReviews} reviews)
                  </span>
                </div>
              </div>
              <div className="user-detail-contact-me">
                <button>Contact Me</button>
              </div>
              <div className="user-detail-where-abouts-container">
                <ul>
                  <li>
                    <span>
                      <IoLocationSharp className="inline" />
                      From
                    </span>
                    <p>{gigUser.country}</p>
                  </li>
                  <li>
                    <span>
                      <FaUser className="inline" />
                      Member Since
                    </span>
                    <p>
                      <Moment format="MMM YYYY">{gigUser.userSince}</Moment>
                    </p>
                  </li>
                  <li>
                    <span>
                      {" "}
                      <FaPaperPlane className="inline" /> Last Delivery
                    </span>
                    <p>
                      {gigUser.lastDelivery ? (
                        <Moment fromNow>{gigUser.lastDelivery}</Moment>
                      ) : (
                        "---"
                      )}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <nav className="user-detail-navigation-container">
              <button>
                <a href="#user-detail-about-section">About</a>
              </button>
              <button>
                <a href="#user-detail-gigs-section">Gigs</a>
              </button>
              <button>
                <a href="#user-detail-reviews-section">Reviews</a>
              </button>
            </nav>
            <div
              id="user-detail-about-section"
              className="user-info-large-screen-border"
            >
              <div className="user-core-container">
                <div className="user-detail-description">
                  <h3>Description</h3>
                  <p>{gigUser.description}</p>
                </div>
                <div className="user-detail-language">
                  <h3>Languages</h3>
                  <ul>
                    {gigUser.languages.map((language, index) => (
                      <li key={index}>
                        <span className="user-detail-language-name">
                          {language}
                        </span>
                        &nbsp;&nbsp;–
                        <span className="user-detail-language-fluency">
                          {" "}
                          Fluent
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="user-detail-skills-container">
                  <h3>Skills</h3>
                  <ul>
                    {gigUser.skills.map((skill, index) => (
                      <li key={index}>{skill.name}</li>
                    ))}
                  </ul>
                </div>
                <div className="user-detail-education-container">
                  <h3>Education</h3>
                  <ul>
                    {gigUser.education.map((item, index) => (
                      <li key={index}>
                        <div>
                          <span>{item.degree}</span>
                          &nbsp;
                          <span>-</span>
                          &nbsp;
                          <span>{item.major}</span>
                        </div>
                        <div className="user-detail-college">
                          <span>{item.collegeName},</span>
                          &nbsp;
                          <span>{item.country},</span>
                          &nbsp;
                        </div>
                        <div className="user-detail-graduated-year">
                          Graduated &nbsp;
                          <span>{item.yearOfGraduation}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="user-detail-certification-container">
                  <h3>Certification</h3>
                  <ul>
                    {gigUser.certificates.map((certificate, index) => (
                      <li key={index}>
                        <div>{certificate.name}</div>
                        <div className="user-detail-certified-from">
                          {certificate.certifiedFrom} &nbsp; {certificate.year}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div
            id="user-detail-gigs-section"
            className="user-detail-gig-reviews-div"
          >
            {user?._id === gigUser._id && (
              <div className="user-detail-active-gigs-container">
                <div
                  className={`active-gig  + ${active ? "selected" : ""}`}
                  onClick={() => setActive(true)}
                >
                  active gigs
                </div>
                <div
                  className={`draft-gig  + ${!active ? "selected" : ""}`}
                  onClick={() => setActive(false)}
                >
                  drafts
                </div>
              </div>
            )}
            <div className="user-detail-gig-list-container">
              <h2>{gigUser.name}'s Gigs</h2>
              <div className="user-detail-gig-list">
                {active
                  ? userGigs &&
                    userGigs.map((userGig) => {
                      if (userGig.active) {
                        return (
                          <GigCard gig={userGig} key={userGig._id}></GigCard>
                        );
                      }
                    })
                  : userGigs &&
                    userGigs.map((userGig) => {
                      if (!userGig.active) {
                        return (
                          <GigCard gig={userGig} key={userGig._id}></GigCard>
                        );
                      }
                    })}
                {windowWidth > 900 && user?._id === gigUser._id && (
                  <div
                    onClick={() =>
                      navigate({
                        pathname: "/gig/create/new/gig",
                        search: "?id=null",
                      })
                    }
                    className="user-detail-create-new-gig-card"
                  >
                    <div className="add-circle-icon">
                      <AddCircleIcon
                        style={{ fontSize: "50px", color: "#62646a" }}
                      ></AddCircleIcon>
                    </div>
                    <div>Create a new Gig</div>
                  </div>
                )}
              </div>
            </div>
            <div id="user-detail-reviews-section" className="user-detail-review-list-container">
              <div className="user-detail-review-list">
                <h2>
                  <span className="user-detail-review-heading">Reviews</span>{" "}
                  &nbsp; &nbsp;
                  <div className="user-detail-review-rating-stars">
                    <FaStar />
                    <RatingStars rating={gigUser.ratings}></RatingStars>
                    &nbsp; &nbsp;
                  </div>
                  <span className="user-detail-gig-rating">
                    {gigUser.ratings.toFixed(1)}
                  </span>
                  &nbsp; &nbsp;
                  <span className="user-detail-gig-review-count">
                    ({gigUser.numOfRatings})
                  </span>
                </h2>
                {gigUser.reviews.map(
                  (review, index) =>
                    index < reviewCount && (
                      <div className="user-detail-review">
                        <div className="user-detail-review-customer">
                          <div className="user-detail-review-customer-img">
                            <Avatar
                              userName={review.name}
                              avatarUrl={review.avatar.url}
                              width={"2rem"}
                              fontSize={"1rem"}
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
                            <Moment fromNow={true}>{review.createdAt}</Moment>
                          </span>
                        </p>
                      </div>
                    )
                )}
                {isAuthenticated && user.reviews.length > reviewCount && (
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
        </div>
      )
    );
};
