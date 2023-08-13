import { Rating } from "@mui/material";
import React, { useRef, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { TextArea } from "../TextArea/TextArea";
import { updateOrderDetail } from "../../actions/orderAction";
import { axiosInstance } from "../../utility/axiosInstance";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

export const SellerFeedback = () => {
  const commentRef = useRef();
  const dispatch = useDispatch();
  const params = useParams();
  const [rating, setRating] = useState(0);

  const handleRatingChanged = (e, val) => {
    setRating(val);
  };

  const handleSendFeedback = async () => {
    try{
      const feedback = {
        rating,
        comment: commentRef.current.currValue,
      } 
      const { data } = await axiosInstance.post(`/order/${params.id}/seller/feedback`, feedback);
      dispatch(updateOrderDetail(data.order));
      
    }
    catch(err){
      console.log(err);
    }
  };

  return (
    <div className="text-light_grey rounded border">
      <h3 className="font-semibold text-base sm:text-xl mb-4 bg-separator py-3 px-4">
        Review your experience with this buyer
      </h3>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8 mb-6 px-4">
        <div className="max-w-[35ch]">
          <h4 className="font-semibold text-base sm:text-lg">Overall Experince </h4>
          <p className="text-sm sm:text-base text-light_heading leading-5">
            How would you rate your overall experience with this buyer?
          </p>
        </div>

        <Rating
          size="medium"
          value={rating}
          onChange={(e, val) => handleRatingChanged(e, val)}
          icon={<FaStar className="text-gold" />}
          emptyIcon={<FaRegStar className="text-gold" />}
        />
      </div>
      <div className="px-4">
        <p className="font-semibold mb-3">Share some details (public)</p>
        <TextArea
          maxLength={700}
          style={{ height: "10rem" }}
          ref={commentRef}
          placeholder="You'll be able to view the buyer's feedback after you leave your feedback."
        />
      </div>
      <div className="flex items-center justify-end my-6 px-4 gap-4">
        <button
          onClick={handleSendFeedback}
          className="px-8 py-3 rounded text-white bg-primary hover:bg-primary_hover hover:cursor-pointer"
        >
          Send Feedback
        </button>
      </div>
    </div>
  );
};
