import React from "react";
import { IReview } from "../../types/gig.types";
import { Avatar } from "../Avatar/Avatar";
import { RatingStars } from "../RatingStars/RatingStars";
import { flags } from "../../data/country-flags";
import Moment from "react-moment";

type ReviewsListProps = {
  gigReviews: IReview[];
  reviewCount: number;
  setReviewCount: React.Dispatch<React.SetStateAction<number>>;
  increaseReviewCount: () => void;
};

const ReviewsList = ({
  gigReviews,
  reviewCount,
  setReviewCount,
  increaseReviewCount,
}: ReviewsListProps) => {
  const getFlag = (flagName: string) =>
    flags.find((flag) => {
      if (flag.name === flagName) {
        return flag;
      }
      return null;
    });
  return (
    <>
      {gigReviews.map((review, index) => {
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
                <RatingStars rating={review.rating} />
                <div>{review.rating}</div>
              </div>
              <div className="user-detail-review-customer-country">
                <img src={getFlag(review.country)?.image} alt="country flag" />
                <div>{review.country}</div>
              </div>
              <p className="user-detail-review-paragraph">{review.comment}</p>
              <p className="user-detail-review-publish">
                Published &nbsp;
                <span>
                  <Moment fromNow={true}>{review.createdAt}</Moment>
                </span>
              </p>
            </div>
          )
        );
      })}
      {gigReviews?.length > reviewCount && (
        <div className="user-review-see-more" onClick={increaseReviewCount}>
          + See more
        </div>
      )}
    </>
  );
};

export default ReviewsList;
