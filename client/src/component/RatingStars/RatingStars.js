import React from "react";
import "./ratingStars.css";

export const RatingStars = ({ rating }) => {
  const starRatings = (rating) => {
    const ratingPercentage = rating * 10 * 2;
    return ratingPercentage + "%";
  };

  return (
    <div className="user-detail stars-outer">
      <div
        className="stars-inner"
        style={{ width: starRatings(rating.toFixed(1)) }}
      ></div>
    </div>
  );
};
