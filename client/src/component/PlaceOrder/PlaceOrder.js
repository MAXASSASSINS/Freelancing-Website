import React, { useEffect, useRef, useState } from "react";
import { StripeContainer } from "../StripeContainer.js/StripeContainer";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getGigDetail, getUserGigs } from "../../actions/gigAction";
import { FiCheck } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { AiFillQuestionCircle } from "react-icons/ai";
import { Tooltip } from "../Tooltip/Tooltip.js";
import { DataSendingLoading } from "../DataSendingLoading/DataSendingLoading.js";
import { numberToCurrency } from "../../utility/util";
import { axiosInstance } from "../../utility/axiosInstance";

const stripePromise = loadStripe(
  "pk_test_51MtFFeSAmwdBmm1f0hqgnIYATUgc4R2mqS4M35gX3zAFo870EWa7DPOSpM79cBBJbHYkAN4qEKbDdukHEpYxdOXd00xnfGsKMi"
);

export const PlaceOrder = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  const stripeContainerRef = useRef(null);

  useEffect(() => {
    dispatch(getGigDetail(params.id));
  }, [dispatch, params.id]);

  const { gigDetail } = useSelector((state) => state.gigDetail);
  const packageNumber = params.packageNumber;
  const packageDetail = gigDetail?.pricing[packageNumber];
  //

  const handleConfirmPaymentClick = async () => {
    // await stripeContainerRef.current.callSubmit();
    const orderData = {
      gigId: params.id,
      packageNumber: params.packageNumber,
    };

    // creating razor pay payment intent
    const {
      data: { order },
    } = await axiosInstance.post("/package/payment", {
      ...orderData,
    });

    const options = {
      key: "rzp_test_voPXCfG7Iw6NH7",
      amount: order.amount,
      currency: "INR",
      name: "FreelanceMe",
      description: "Test Transaction",
      image: "/images/avatar.avif",
      order_id: order.id,
      handler: function (response) {
        handlePaymentVerification(response, orderData);
      },
      prefill: {
        name: user.name, //your customer's name
        email: user.email,
        contact: "8900000000", //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#a6a5a5",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  const handlePaymentVerification = async (response, orderData) => {
    const payload = {
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
      ...orderData,
    };

    const { data } = await axiosInstance.post("/payment/verification", payload);
    navigate(`/gig/place/order/submit/requirements/${data.order._id}`)
  };

  return (
    <div className="relative min-h-[500px]">
      <DataSendingLoading finishedLoading={!loading} show={loading} />
      <div className="px-8 py-12 md:px-32 flex flex-col items-center gap-16 min-[1050px]:px-12 min-[1050px]:flex-row min-[1050px]:justify-between min-[1050px]:items-start xl:px-24 xl:justify-center xl:gap-32">
        {/* <div className="xl:flex-1 2xl:flex-none">
          <Elements stripe={stripePromise}>
            <StripeContainer
              ref={stripeContainerRef}
              setParentLoadingStatus={setLoading}
            />
          </Elements>
        </div> */}

        {gigDetail && (
          <div className="bg-separator max-w-sm rounded-[3] text-light_heading border border-dark_separator">
            <div className="p-4">
              <div className="flex gap-4 pb-4 border-b border-no_focus items-center">
                <div>
                  <img
                    src={gigDetail.images[0].url}
                    alt="gig showcase"
                    className="max-w-[120px] aspect-[16/10]  rounded-[4px]"
                  />
                </div>
                <h3 className="leading-6 font-semibold">{gigDetail.title}</h3>
              </div>
              <div>
                <div className="flex justify-between mt-3">
                  <h4 className="font-bold">{packageDetail.packageTitle}</h4>
                  <p>₹{numberToCurrency(packageDetail.packagePrice)}</p>
                </div>
                <div className="mt-4">
                  <ul className="flex flex-col gap-2">
                    <li className="grid grid-cols-[30px_auto] items-center">
                      <FiCheck className="text-primary font-bold text-xl" />
                      <span>
                      {packageDetail.revisions < 1e6 ? packageDetail.revisions : 'Unlimited'}
                      {' '}
                        {packageDetail.revisions === 1
                          ? "revision"
                          : "revisions"}
                      </span>
                    </li>
                    <li className="grid grid-cols-[30px_auto] items-center">
                      {packageDetail.commercialUse ? (
                        <FiCheck className="text-primary font-bold text-xl" />
                      ) : (
                        <IoClose className="text-error font-bold text-xl" />
                      )}
                      <span className="">Commercial Use</span>
                    </li>
                    <li className="grid grid-cols-[30px_auto] items-center">
                      {packageDetail.sourceFile ? (
                        <FiCheck className="text-primary font-bold text-xl" />
                      ) : (
                        <IoClose className="text-error text-xl" />
                      )}
                      <span>Source File</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-white border-x-0 border-y border-dark_separator">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex gap-1">
                  <div>Service Fee </div>
                  <AiFillQuestionCircle
                    id="serviceFee"
                    className="text-no_focus no-select"
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="This helps us to operate our platform and offer 24/7 customer support for your orders."
                    data-tooltip-place="bottom"
                  />
                </div>
                <div>
                  ₹{numberToCurrency(Number(packageDetail.packagePrice) * 0.21)}
                </div>
              </div>
            </div>
            <div className=" bg-white px-4 py-3 flex items-center justify-between text-[18px]">
              <div className="font-bold">Total</div>
              <div className="font-bold">
                ₹{numberToCurrency(Number(packageDetail.packagePrice) * 1.21)}
              </div>
            </div>
            <div className="bg-white px-4 flex items-center justify-between">
              <div className="">Total delivery Time</div>
              <div>
                {packageDetail.packageDeliveryTime.replace("delivery", "")}
              </div>
            </div>
            <div className="px-4 pt-12 bg-white">
              <button
                onClick={handleConfirmPaymentClick}
                className="px-4 py-3 w-full bg-dark_grey text-white rounded-[4px] hover:cursor-pointer hover:bg-light_grey"
              >
                Confirm & Pay
              </button>
              <p className="py-3 text-center text-no_focus text-[14px] leading-5">
                You will be charged ₹
                {numberToCurrency(Number(packageDetail.packagePrice) * 1.21)}.
                Total amount includes currency conversion fees.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
