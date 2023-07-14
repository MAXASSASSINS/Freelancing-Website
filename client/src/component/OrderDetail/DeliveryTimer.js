import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DeliveryModal as Del, DeliveryModal } from "./DeliveryModal";

export const DeliveryTimer = ({ orderDetail }) => {
  const [deliveryTimeLeft, setDeliveryTimeLeft] = useState(
    new Date(orderDetail.deliveryDate) - Date.now()
  );

  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDeliveryTimeLeft(new Date(orderDetail.deliveryDate) - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClickOnDelivery = () => {
    setShowDeliveryModal(true);
  };

  const closeDeliveryModal = () => {
    setShowDeliveryModal(false);
  };

  return (
    <>
      {showDeliveryModal && (
        <DeliveryModal
          orderDetail={orderDetail}
          closeDeliveryModal={closeDeliveryModal}
        />
      )}
      <div className="bg-white p-4 flex flex-col gap-4 rounded">
        <div className="font-semibold text-light_heading">
          Time left to deliver
        </div>
        <div className="flex items-center justify-center gap-3 text-center">
          <div>
            <div className="pb-1 font-bold">
              {parseInt(deliveryTimeLeft / (1000 * 60 * 60 * 24))}
            </div>
            <div>Days</div>
          </div>
          <div>|</div>
          <div>
            <div className="pb-1 font-bold">
              {new Date(deliveryTimeLeft).getUTCHours()}
            </div>
            <div>Hours</div>
          </div>
          <div>|</div>
          <div>
            <div className="pb-1 font-bold">
              {new Date(deliveryTimeLeft).getUTCMinutes()}
            </div>
            <div>Minutes</div>
          </div>
          <div>|</div>
          <div>
            <div className="pb-1 font-bold">
              {new Date(deliveryTimeLeft).getUTCSeconds()}
            </div>
            <div>Seconds</div>
          </div>
        </div>
        <Link
          onClick={handleClickOnDelivery}
          className="px-4 py-3 rounded bg-primary text-white font-semibold text-center hover:bg-primary_hover"
        >
          <button className="capitalize">deliver now</button>
        </Link>
      </div>
    </>
  );
};
