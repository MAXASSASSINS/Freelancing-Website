import React from "react";
import { FiCheck } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import Moment from "react-moment";

export const OrderDetailSideModal = ({ orderDetail }) => {
  return (
    <div className="hidden md:block bg-white min-w-[14rem] max-w-[20rem] border-1 border-dark_separator order-2 col-span-6 sm:col-start-2 sm:col-span-4  md:order-3 md:col-span-4 lg:col-span-3">
      <img className="aspect-[16/10]" src={orderDetail.image.url}></img>
      <div className="p-3">
        <div className="border-b-1 border-b-dark_separator">
          <h5 className="font-bold">{orderDetail.gigTitle}</h5>
          <div className="mt-3">
            <ul className="flex flex-col gap-1 mb-3">
              <li className="grid grid-cols-[30px_auto] items-center">
                <FiCheck className="text-primary font-bold text-xl" />
                <span>
                  {orderDetail.packageDetails.revisions}{" "}
                  {orderDetail.packageDetails.revisions === 1
                    ? "revision"
                    : "revisions"}
                </span>
              </li>
              <li className="grid grid-cols-[30px_auto] items-center">
                {orderDetail.packageDetails.commercialUse ? (
                  <FiCheck className="text-primary font-bold text-xl" />
                ) : (
                  <IoClose className="text-error font-bold text-xl" />
                )}
                <span className="">Commercial Use</span>
              </li>
              <li className="grid grid-cols-[30px_auto] items-center">
                {orderDetail.packageDetails.sourceFile ? (
                  <FiCheck className="text-primary font-bold text-xl" />
                ) : (
                  <IoClose className="text-error text-xl" />
                )}
                <span>Source File</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-3 py-4 [&>*]:flex [&>*]:justify-between">
          <div>
            <span>Status</span>
            <span className="py-1 px-2 bg-yellow-500 text-white uppercase text-[10px] rounded-[3px]">
              {orderDetail.status}
            </span>
          </div>
          <div>
            <span>Order</span>
            <span>#{orderDetail.orderId}</span>
          </div>
          <div>
            <span>Order Date</span>
            <span>
              <Moment format="ll">{orderDetail.createdAt}</Moment>
            </span>
          </div>
          <div>
            <span>Price</span>
            <span>₹{Number(orderDetail.amount).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
