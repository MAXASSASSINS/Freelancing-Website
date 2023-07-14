import React, { useState, useEffect, useContext } from "react";
import { DateTag } from "../DateTag";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Moment from "react-moment";
import { GrDocument } from "react-icons/gr";
import { IoDocumentOutline } from "react-icons/io5";
import { RiRocket2Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import { GoPencil } from "react-icons/go";
import { BiTimeFive } from "react-icons/bi";
import { Avatar } from "../Avatar/Avatar";
import { DataSendingLoading } from "../DataSendingLoading/DataSendingLoading";
import { LazyImage } from "../LazyImage/LazyImage";
import { LazyVideo } from "../LazyVideo.js/LazyVideo";
import { windowContext } from "../../App";
import { HiDownload } from "react-icons/hi";
import { getFileSize, downloadFile } from "../../utility/util";
import { OrderMessageInput } from "./OrderMessageInput";
import { SocketContext } from "../../context/socket/socket";
import { DeliveryTimer } from "./DeliveryTimer";
import { orderReducer } from "../../reducers/orderReducer";

export const Activities = ({ orderDetail }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, userLoading, userError } = useSelector(
    (state) => state.user
  );

  const [online, setOnline] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);

  // console.log(fileLoading);

  const socket = useContext(SocketContext);
  const { windowWidth } = useContext(windowContext);

  const params = useParams();
  // console.log(orderDetail);
  const [orderMessages, setOrderMessages] = useState([]);

  // console.log(orderMessages);

  useEffect(() => {
    getOrderMessages();
  }, []);

  // online status of seller or buyer
  useEffect(() => {
    const userToCheck =
      user._id.toString() === orderDetail.buyer._id.toString()
        ? orderDetail.seller._id
        : orderDetail.buyer._id;
    socket.emit("is_online", userToCheck);
  }, [orderDetail, socket]);

  useEffect(() => {
    socket.on("is_online_from_server", (data) => {
      // console.log(data);
      const onlineClientId = data.id.toString();
      const userToCheck =
        user._id.toString() === orderDetail.buyer._id.toString()
          ? orderDetail.seller._id
          : orderDetail.buyer._id;
      if (onlineClientId === userToCheck) {
        setOnline(data.online);
      }
    });

    socket.on("online_from_server", (data) => {
      const onlineClientId = data.toString();
      const userToCheck =
        user._id.toString() === orderDetail.buyer._id.toString()
          ? orderDetail.seller._id
          : orderDetail.buyer._id;
      if (onlineClientId === userToCheck) {
        setOnline(true);
      }
    });

    socket.on("offline_from_server", (data) => {
      console.log("offline from server", data);
      const onlineClientId = data?.toString();

      const userToCheck =
        user._id.toString() === orderDetail.buyer._id.toString()
          ? orderDetail.seller._id
          : orderDetail.buyer._id;
      if (onlineClientId.toString() === userToCheck.toString()) {
        setOnline(false);
      }
    });

    return () => {
      socket.off("is_online_from_server");
      socket.off("online_from_server");
      socket.off("offline_from_server");
    };
  }, [orderDetail.id, socket]);

  // console.log('orderMessages', orderMessages);
  // CHECKING FOR RECEIVING MESSAGES
  useEffect(() => {
    socket.on("receive_message", async (data) => {
      console.log("receive message is running");
      console.log("data", data);

      if (data.orderId !== params.id) {
        return;
      }

      setOrderMessages((prev) => {
        const date = new Date(data.createdAt)
          .toLocaleDateString()
          .substring(0, 10);
        let found = false;
        prev.forEach((message) => {
          if (message.date === date) {
            console.log("found date");
            found = true;
            message.dateWiseMessages.push(data);
          }
        });
        if (!found) {
          prev.push({
            date,
            dateWiseMessages: [data],
          });
        }
        return [...prev];
      });
    });

    return () => {
      socket.off("receive_message");
    };
  }, [fileLoading, socket]);

  // CHECKING FOR RECEIVING MESSAGES SELF
  useEffect(() => {
    socket.on(
      "receive_message_self",
      async (data) => {
        console.log("self receive message is running");
        console.log(data);
        if (data.orderId !== params.id) {
          return;
        }
        setOrderMessages((prev) => {
          const date = new Date(data.createdAt)
            .toLocaleDateString()
            .substring(0, 10);
          let found = false;
          prev.forEach((message) => {
            if (message.date === date) {
              found = true;
              message.dateWiseMessages.push(data);
            }
          });
          if (!found) {
            prev.push({
              date,
              dateWiseMessages: [data],
            });
          }
          return [...prev];
        });
      },
      [fileLoading, socket]
    );

    return () => {
      socket.off("receive_message_self");
    };
  });

  const getOrderMessages = async () => {
    try {
      const { data } = await axios.get(`/message/order/${params.id}`);
      console.log(data);

      const messages = buildDateWiseMessages(
        data.messages,
        orderDetail?.deliveries,
        orderDetail?.revisions
      );

      setOrderMessages(messages);
    } catch (error) {
      console.log(error);
    }
  };

  const buildDateWiseMessages = (messages, deliveries, revisions) => {
    let map = new Map();

    for (const message of messages) {
      const date = new Date(message.createdAt)
        .toLocaleDateString()
        .substring(0, 10);
      if (map.has(date)) {
        map.get(date).push(message);
      } else {
        map.set(date, [message]);
      }
    }

    if (deliveries) {
      for (const delivery of deliveries) {
        const date = new Date(delivery.createdAt).toDateString();
        if (map.has(date)) {
          map.get(date).push(delivery);
        } else {
          map.set(date, [delivery]);
        }
      }
    }

    if (revisions) {
      for (const revision of revisions) {
        const date = new Date(revision.createdAt).toDateString();
        if (map.has(date)) {
          map.get(date).push(revision);
        } else {
          map.set(date, [revision]);
        }
      }
    }

    map = new Map([...map.entries()].sort());

    map = Array.from(map, ([date, dateWiseMessages]) => ({
      date,
      dateWiseMessages,
    }));

    map.map((dateWiseMessage) => {
      console.log(dateWiseMessage.date);
    });

    setOrderMessages(map);
    // console.log(dateWiseMessages);
    return map;
  };

  // console.log(orderMessages);

  return (
    <>
      <div className="mb-8 min-[900px]:hidden">
        <DeliveryTimer orderDetail={orderDetail} />
      </div>
      <div className="bg-white relative py-8 text-sm sm:text-base">
        <DataSendingLoading
          show={fileLoading}
          loadingText={"sending message"}
        />

        <section className="relative pl-6 flex flex-col gap-4 pb-12">
          <DateTag
            left={"-1.5rem"}
            date={new Date(orderDetail.createdAt).toLocaleDateString()}
          />

          <div className="flex items-center gap-4 font-semibold text-light_heading">
            <div className="p-2 aspect-square bg-purple-200 text-purple-600 rounded-full">
              <IoDocumentOutline />
            </div>
            <div className="[&>*]:leading-5 py-2 pr-6 border-b flex-grow border-b-dark_separator">
              <span className="mr-2">
                {orderDetail.buyer._id === user._id ? (
                  "You"
                ) : (
                  <Link
                    to={`/user/${orderDetail.buyer._id}`}
                    className="text-primary hover:underline"
                  >
                    {orderDetail.buyer.name}
                  </Link>
                )}
                &nbsp; placed the order
              </span>
              <span className="text-icons font-normal text-xs">
                <Moment format="MMM DD, H:mm A">{orderDetail.createdAt}</Moment>
              </span>
            </div>
          </div>

          {Date.now(orderDetail.requirementsSubmittedAt).toString() ===
            Date.now(orderDetail.createdAt).toString() && (
            <>
              <div className="flex items-center gap-4 font-semibold text-light_heading">
                <div className="p-2 aspect-square bg-blue-200 text-blue-600  rounded-full">
                  <GoPencil />
                </div>
                <div className="[&>*]:leading-5 pr-6 flex-grow py-2 border-b border-b-dark_separator">
                  <span className="mr-2">
                    {orderDetail.buyer._id === user._id ? (
                      "You "
                    ) : (
                      <Link
                        to={`/user/${orderDetail.buyer._id}`}
                        className="text-primary hover:underline"
                      >
                        {orderDetail.buyer.name}
                      </Link>
                    )}
                    &nbsp; sent the requirements
                  </span>
                  <span className="text-icons font-normal text-xs">
                    <Moment format="MMM DD, H:mm A">
                      {orderDetail.createdAt}
                    </Moment>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 font-semibold text-light_heading">
                <div className="p-2 aspect-square bg-green-200 text-green-600  rounded-full">
                  <RiRocket2Line />
                </div>
                <div className="flex-grow pr-6 [&>*]:leading-5 py-2 border-b border-b-dark_separator">
                  <span className="mr-2">The order started</span>
                  <span className="text-icons font-normal text-xs">
                    <Moment format="MMM DD, H:mm A">
                      {orderDetail.createdAt}
                    </Moment>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 font-semibold text-light_heading">
                <div className="p-2 aspect-square bg-green-200 text-green-600  rounded-full">
                  <BiTimeFive />
                </div>
                <div className="flex-grow pr-6 [&>*]:leading-5 py-2 border-b border-b-dark_separator">
                  <span className="mr-2">
                    The delivery date was updated to &nbsp;
                    <Moment format="MMM DD">{orderDetail.deliveryDate}</Moment>
                  </span>
                  <span className="text-icons font-normal text-xs">
                    <Moment format="MMM DD, H:mm A">
                      {orderDetail.createdAt}
                    </Moment>
                  </span>
                </div>
              </div>
            </>
          )}
        </section>

        {Date.now(orderDetail.requirementsSubmittedAt).toString() !==
          Date.now(orderDetail.createdAt).toString() && (
          <section className="relative pl-6 flex flex-col gap-4 pb-12">
            <DateTag
              left={"-1.5rem"}
              date={new Date(
                orderDetail.requirementsSubmittedAt
              ).toLocaleDateString()}
            />
            <div className="flex items-center gap-4 font-semibold text-light_heading">
              <div className="p-2 aspect-square bg-blue-200 text-blue-600  rounded-full">
                <GoPencil />
              </div>
              <div className="pr-6 [&>*]:leading-5 py-2 border-b flex-grow border-b-dark_separator">
                <span className="mr-2">
                  {orderDetail.buyer._id === user._id ? (
                    "You "
                  ) : (
                    <Link
                      to={`/user/${orderDetail.buyer._id}`}
                      className="text-primary hover:underline"
                    >
                      {orderDetail.buyer.name}
                    </Link>
                  )}
                  &nbsp; sent the requirements
                </span>
                <span className="text-icons font-normal text-xs">
                  <Moment format="MMM DD, H:mm A">
                    {orderDetail.createdAt}
                  </Moment>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 font-semibold text-light_heading">
              <div className="p-2 aspect-square bg-green-200 text-green-600  rounded-full">
                <RiRocket2Line />
              </div>
              <div className="pr-6 [&>*]:leading-5 py-2 border-b flex-grow border-b-dark_separator">
                <span className="mr-2">The order started</span>
                <span className="text-icons font-normal text-xs">
                  <Moment format="MMM DD, H:mm A">
                    {orderDetail.createdAt}
                  </Moment>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 font-semibold text-light_heading">
              <div className="p-2 aspect-square bg-green-200 text-green-600  rounded-full">
                <BiTimeFive />
              </div>
              <div className="pr-6 [&>*]:leading-5 flex-grow py-2 border-b border-b-dark_separator">
                <span className="mr-2">
                  The delivery date was updated to &nbsp;
                  <Moment format="MMM DD">{orderDetail.deliveryDate}</Moment>
                </span>
                <span className="text-icons font-normal text-xs">
                  <Moment format="MMM DD, H:mm A">
                    {orderDetail.createdAt}
                  </Moment>
                </span>
              </div>
            </div>
          </section>
        )}

        {orderMessages.length > 0 &&
          orderMessages.map((obj, index) => (
            <section
              key={index}
              className="relative pl-6 flex flex-col gap-4 pb-16"
            >
              <DateTag left={"-1.5rem"} date={obj.date} />

              {obj.dateWiseMessages.length > 0 &&
                obj.dateWiseMessages.map((message) => (
                  <div className="">
                    <div
                      key={message._id}
                      className="flex items-center gap-4 font-semibold text-light_heading"
                    >
                      <div className="aspect-square rounded-full">
                        <Avatar
                          avatarUrl={message.sender.avatar.url}
                          userName={message.sender.name}
                          width="1.75rem"
                          fontSize="1rem"
                          alt={message.sender.name}
                        />
                      </div>
                      <div className="[&>*]:leading-5 flex-grow pr-6 py-2 border-b border-b-dark_separator">
                        <span className="mr-2">
                          {message.sender._id === user._id ? (
                            "You"
                          ) : (
                            <Link
                              to={`/user/${message.sender._id}`}
                              className="text-primary hover:underline"
                            >
                              {message.sender.name}
                            </Link>
                          )}
                          &nbsp; sent &nbsp;
                          {message.receiver._id === user._id ? (
                            "You "
                          ) : (
                            <Link
                              to={`/user/${message.receiver._id}`}
                              className="text-primary hover:underline"
                            >
                              {message.receiver.name}
                            </Link>
                          )}
                          &nbsp; a message
                        </span>
                        <span className="text-icons font-normal text-xs">
                          <Moment format="MMM DD, H:mm A">
                            {message.createdAt}
                          </Moment>
                        </span>
                      </div>
                    </div>
                    <div className="pt-2 ml-11 pb-4 border-b">
                      <p className="leading-5 pr-6 text-dark_grey max-w-2xl">
                        {message.message.text}
                      </p>
                      <div className="mt-8 pr-6 flex flex-col gap-8 min-[500px]:grid min-[500px]:grid-cols-2 min-[500px]:items-end min-[1200px]:grid-cols-3">
                        {message.files?.map((file, index) => (
                          <div key={index} className="">
                            <p className="flex flex-col justify-end max-w-[8rem] max-h-48 min-h-[5rem] min-w-[5rem] overflow-hidden min-[500px]:max-w-[10rem] min-[1000px]:max-w-[12rem]">
                              {file.type.includes("video") ? (
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener"
                                >
                                  <LazyVideo
                                    file={file}
                                    maxWidth={windowWidth > 1024 ? 240 : 160}
                                  />
                                </a>
                              ) : file.type.includes("image") ? (
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener"
                                >
                                  <LazyImage
                                    file={file}
                                    maxWidth={windowWidth > 1024 ? 240 : 160}
                                  />
                                </a>
                              ) : file.type.includes("audio") ? (
                                <audio
                                  className="max-w-[10rem] min-[1000px]:max-w-[12rem]"
                                  preload="none"
                                  controls
                                  src={file.url}
                                />
                              ) : (
                                <div className="bg-separator w-40 h-24 flex justify-center items-center text-5xl rounded min-[1000px]:w-48 min-[1000px]:h-28">
                                  <div>
                                    <IoDocumentOutline />
                                  </div>
                                </div>
                              )}
                            </p>
                            <div
                              onClick={() => downloadFile(file.url, file.name)}
                              className="max-w-[8rem] flex flex-col justify-between gap-2 cursor-pointer mt-2 text-xs bg-separator p-2 min-[500px]:max-w-[10rem] min-[1000px]:max-w-[12rem]"
                            >
                              <div className="flex justify-between items-center hover:cursor-pointer hover:text-primary">
                                <HiDownload />
                                <div
                                  data-tooltip-id="my-tooltip"
                                  data-tooltip-content={file.name}
                                  data-tooltip-place="bottom"
                                  className="w-[12ch] sm:w-[15ch] text-right whitespace-nowrap overflow-hidden"
                                >
                                  {file.name}
                                </div>
                              </div>
                              <p className="text-right">
                                ({getFileSize(file.size ? file.size : 0)})
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </section>
          ))}

        <section className="relative pl-6 flex flex-col gap-4 pb-4">
          <div className="flex items-center gap-4 text-light_heading">
            <div className="aspect-square rounded-full">
              <Avatar
                avatarUrl={user.avatar.url}
                userName={user.name}
                width="1.75rem"
                fontSize="1rem"
                alt={user.name}
              />
            </div>
            <div className="[&>*]:leading-5 py-2 pr-6 flex-grow  flex justify-between items-center">
              <span className="mr-2 font-semibold text-primary">
                Have something to share with &nbsp;
                <Link
                  to={`/user/${orderDetail.seller._id}`}
                  className="text-primary hover:underline"
                >
                  {orderDetail.seller.name}
                </Link>
                ?
              </span>
              <span className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 text-light_heading rounded-full ${
                    online ? "bg-primary" : "bg-no_focus"
                  }`}
                ></div>
                <div>Seller is {online ? "Online" : "Offline"}</div>
              </span>
            </div>
          </div>
        </section>
        <div className="px-6">
          <OrderMessageInput
            fileLoading={fileLoading}
            setFileLoading={(val) => setFileLoading(val)}
            orderDetail={orderDetail}
          />
        </div>
      </div>
    </>
  );
};
