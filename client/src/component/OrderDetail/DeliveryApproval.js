import React, { useState } from "react";
import { FaRobot } from "react-icons/fa";
import { useSelector } from "react-redux";
import { OrderMessageInput } from "./OrderMessageInput";
import { ChatBox } from "./ChatBox";
import { BiChevronLeft } from "react-icons/bi";

const DeliveryApproval = ({setFileLoading}) => {
  const { orderDetail } = useSelector((state) => state.orderDetail);

  const [showRevision, setShowRevision] = useState(false);

  const handleCompletedRevisionRequest = (val) => {
    setShowRevision(false);
    setFileLoading(val);
  }

  return (
    <section className="flex ml-6  pb-4 mb-12 border-b gap-4 items-start">
      <div className="w-7 h-7 flex items-center justify-center bg-light_heading rounded-full text-white">
        <FaRobot />
      </div>

      {!showRevision ? (
        <div className="flex-grow mr-6">
          <div className="text-light_heading font-semibold">
            <p className="mb-2">
              You received your delivery from {orderDetail.seller.name}.
            </p>
            <p className="mb-1">
              Are you pleased with the delivery and ready to approve it?
            </p>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <button className="bg-primary text-white px-4 py-2 rounded-sm hover:bg-primary_hover hover:cursor-pointer">
              Yes, I approve the delivery
            </button>
            <button
              onClick={() => setShowRevision(true)}
              className="bg-primary text-white px-4 py-2 rounded-sm hover:bg-primary_hover hover:cursor-pointer"
            >
              I'm not ready yet
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-grow mr-6">
          <div className="text-light_heading font-semibold">
            <p className="mb-1">
              What revisions would you like {orderDetail.seller.name} to make?
            </p>
          </div>
          <div className="mt-4">
            <ChatBox setFileLoading={handleCompletedRevisionRequest} isRevisionMessage={true}/>
          </div>

          <div onClick={() => setShowRevision(false)} className="flex items-center justify-end text-light_heading font-semibold mt-4 hover:underline hover:cursor-pointer">
            <BiChevronLeft />
            <span>Back</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default DeliveryApproval;
