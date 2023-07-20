import React, { useState, useEffect, useRef } from "react";

import { Rating } from "@mui/material";
import { FaRegStar, FaStar } from "react-icons/fa";
import { TextArea } from "./TextArea/TextArea";
import { OrderDetailSideModal } from "./OrderDetail/OrderDetailSideModal";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetail, updateOrderDetail } from "../actions/orderAction";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export const Feedback = () => {
  const feedbackQuestions = [
    {
      title: "Communication with Seller",
      description: "How responsive was the seller during the process?",
    },
    {
      title: "Service as Described",
      description: "Did the result match the gig's description?",
    },
    {
      title: "Buy Again or Recommend",
      description: "Would you recommend buying this Gig?",
    },
  ];

  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { orderDetail, orderLoading, orderError } = useSelector(
    (state) => state.orderDetail
  );

  const [ratings, setRatings] = useState([0, 0, 0]);
  const commentRef = useRef(null);

  useEffect(() => {
    dispatch(getOrderDetail(params.id));
  }, []);

  const handleRatingsChanged = (e, newRating, index) => {
    console.log(newRating);
    const newRatings = [...ratings];
    newRatings[index] = newRating;
    setRatings(newRatings);
  };

  const handleSendFeedback = async () => {
    try {
      const feedback = {
        communication: ratings[0],
        service: ratings[1],
        recommend: ratings[2],
        comment: commentRef.current.currValue,
      };
      const { data } = await axios.post(
        `/order/${params.id}/buyer/feedback`,
        feedback
      );
			// dispatch(updateOrderDetail(data));	
      console.log(data);
      navigate(`/orders/${params.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return !orderDetail || orderLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      <div className="px-8 py-4 sm:px-20 sm:py-8 md:px-32 min-[900px]:px-20 lg:px-28 xl:px-40 md:py-12 text-light_grey min-[900px]:flex justify-between gap-20 mx-auto max-w-screen-2xl">
        <div className="flex-grow">
          <div>
            <h1 className="text-lg mb-2 sm:text-xl md:text-2xl md:mb-4 text-icons">
              Public Feedback
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold max-w-[40ch]">
              Share your experience with community, to help make them better
              decisions.
            </h2>
          </div>
          <div className="my-8 md:my-12">
            {feedbackQuestions.map((question, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-2 sm:gap-8 sm:justify-between sm:items-center mb-8"
              >
                <div>
                  <h3 className="sm:text-lg font-semibold mb-1 md:mb-2">
                    {question.title}
                  </h3>
                  <p className="text-sm sm:text-base text-light_heading">
                    {question.description}
                  </p>
                </div>
                <Rating
                  size="medium"
                  value={ratings[index]}
                  onChange={(e, val) => handleRatingsChanged(e, val, index)}
                  icon={<FaStar className="text-gold" />}
                  emptyIcon={<FaRegStar className="text-gold" />}
                />
              </div>
            ))}
          </div>
          <div>
            <h3 className="sm:text-lg md:text-xl mb-4 font-semibold">
              What was it like working with this Seller?
            </h3>
            <TextArea
              maxLength={700}
              placeholder="What did you like or didn't like about this Seller? Share as many details as you can to help other buyers make the right decision for their needs."
              style={{ height: "12rem" }}
              ref={commentRef}
            />
          </div>
          <div className="flex items-center justify-end mt-8 gap-4">
            <button
              onClick={() => navigate(`/orders/${params.id}`)}
              className="text-icons hover:cursor-pointer hover:underline hover:text-dark_grey"
            >
              Skip
            </button>
            <button
              onClick={handleSendFeedback}
              className="px-8 py-3 rounded text-white bg-primary hover:bg-primary_hover hover:cursor-pointer"
            >
              Send Feedback
            </button>
          </div>
        </div>
        <div>
          <OrderDetailSideModal orderDetail={orderDetail} />
        </div>
      </div>
    </div>
  );
};
