import { Rating } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { BiTimeFive } from "react-icons/bi";
import { FaRegStar, FaStar } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import { GoPencil } from "react-icons/go";
import { HiDownload } from "react-icons/hi";
import { IoDocumentOutline } from "react-icons/io5";
import { RiRocket2Line } from "react-icons/ri";
import Moment from "react-moment";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { updateOrderDetail } from "../../actions/orderAction";
import { windowContext } from "../../App";
import { useUpdateGlobalLoading } from "../../context/globalLoadingContext";
import { SocketContext } from "../../context/socket/socket";
import { axiosInstance } from "../../utility/axiosInstance";
import { downloadFile, getFileSize } from "../../utility/util";
import { Avatar } from "../Avatar/Avatar";
import { DateTag } from "../DateTag";
import { SellerFeedback } from "../Feedback/SellerFeedback";
import { LazyImage } from "../LazyImage/LazyImage";
import { LazyVideo } from "../LazyVideo.js/LazyVideo";
import { ChatBox } from "./ChatBox";
import DeliveryApproval from "./DeliveryApproval";
import { DeliveryTimer } from "./DeliveryTimer";

export const Activities = ({ orderDetail }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const { user, isAuthenticated, userLoading, userError } = useSelector(
    (state) => state.user
  );

  const updateGlobalLoading = useUpdateGlobalLoading();

  // const {orderDetail} = useSelector((state) => state.orderDetail);

  const [online, setOnline] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);

  const socket = useContext(SocketContext);
  const { windowWidth } = useContext(windowContext);

  //
  const [orderMessages, setOrderMessages] = useState([]);

  //

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
      //
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
      const onlineClientId = data?.toString();

      const userToCheck =
        user._id.toString() === orderDetail.buyer._id.toString()
          ? orderDetail.seller._id
          : orderDetail.buyer._id;
      if (onlineClientId.toString() === userToCheck?.toString()) {
        setOnline(false);
      }
    });

    return () => {
      socket.off("is_online_from_server");
      socket.off("online_from_server");
      socket.off("offline_from_server");
    };
  }, [orderDetail.id, socket]);

  // CHECKING FOR RECEIVING MESSAGES
  useEffect(() => {
    socket.on("receive_message", async (data) => {
      if (data.orderId !== params.id) {
        return;
      }

      if (data.forDelivery) {
        data = { ...data, deliveryNumber: orderDetail.deliveries.length + 1 };
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
    });

    return () => {
      socket.off("receive_message");
    };
  }, [fileLoading, socket, orderDetail]);

  // CHECKING FOR RECEIVING MESSAGES SELF
  useEffect(() => {
    socket.on(
      "receive_message_self",
      async (data) => {
        if (data.orderId !== params.id) {
          return;
        }

        if (data.forDelivery) {
          data = { ...data, deliveryNumber: orderDetail.deliveries.length };
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
  }, [fileLoading, socket, orderDetail]);

  // CHECKING FOR UPDATES ON ORDER DETAIL
  useEffect(() => {
    socket.on("update_order_detail_server", (data) => {
      dispatch(updateOrderDetail(data));
    });
  }, [fileLoading, socket]);

  // set global loading to true if file loading is true
  useEffect(() => {
    if (fileLoading) {
      updateGlobalLoading(true, "sending message");
    } else {
      updateGlobalLoading(false);
    }
  }, [fileLoading]);

  const getOrderMessages = async () => {
    try {
      const { data } = await axiosInstance.get(`/message/order/${params.id}`);

      const messages = buildDateWiseMessages(
        data.messages,
        orderDetail.deliveries,
        orderDetail.revisions
      );

      setOrderMessages(messages);
    } catch (error) {
      console.log(error);
    }
  };

  const pushMessage = (map, message) => {
    const date = new Date(message.createdAt)
      .toLocaleDateString()
      .substring(0, 10);
    if (map.has(date)) {
      map.get(date).push(message);
    } else {
      map.set(date, [message]);
    }
  };

  const buildDateWiseMessages = (messages, deliveries, revisions) => {
    let map = new Map();

    for (let message of messages) {
      message = { ...message, forDelivery: false, forRevision: false };
      pushMessage(map, message);
    }

    if (deliveries) {
      deliveries.forEach((delivery, index) => {
        const message = {
          _id: delivery._id,
          sender: orderDetail.seller,
          receiver: orderDetail.buyer,
          files: delivery.files,
          message: {
            text: delivery.message,
          },
          createdAt: delivery.deliveredAt,
          orderId: orderDetail._id,
          forDelivery: true,
          forRevision: false,
          deliveryNumber: index + 1,
        };
        pushMessage(map, message);
      });
    }

    if (revisions) {
      for (const revision of revisions) {
        const message = {
          _id: revision._id,
          sender: orderDetail.buyer,
          receiver: orderDetail.seller,
          files: revision.files,
          message: {
            text: revision.message,
          },
          createdAt: revision.requestedAt,
          orderId: orderDetail._id,
          forDelivery: false,
          forRevision: true,
        };
        pushMessage(map, message);
      }
    }

    map = new Map([...map.entries()].sort());

    map = new Map(
      [...map.entries()].map(([key, value]) => {
        const newEntry = value.sort((a, b) => {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
        return [key, newEntry];
      })
    );

    map = Array.from(map, ([date, dateWiseMessages]) => ({
      date,
      dateWiseMessages,
    }));

    map.map((dateWiseMessage) => {});

    setOrderMessages(map);
    //
    return map;
  };

  const buyerFeedback = [
    {
      title: "Communication with Seller",
      description: "How responsive was the seller during the process?",
      value: orderDetail?.buyerFeedback?.communication,
    },
    {
      title: "Service as Described",
      description: "Did the result match the gig's description?",
      value: orderDetail?.buyerFeedback?.service,
    },
    {
      title: "Buy Again or Recommend",
      description: "Would you recommend buying this Gig?",
      value: orderDetail?.buyerFeedback?.recommend,
    },
  ];

  return (
    <>
      {orderDetail.seller._id === user._id &&
        (orderDetail.status === "In Progress" ||
          orderDetail.status === "In Revision") && (
          <div className="mb-8 min-[900px]:hidden">
            <DeliveryTimer orderDetail={orderDetail} />
          </div>
        )}

      {orderDetail && (
        <div className="bg-white rounded relative py-8 text-sm sm:text-base">
          {/* <DataSendingLoading
            show={fileLoading}
            loadingText={"sending message"}
          /> */}

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
                  <Moment format="MMM DD, H:mm A">
                    {orderDetail.createdAt}
                  </Moment>
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
                      <Moment format="MMM DD">
                        {orderDetail.deliveryDate}
                      </Moment>
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
                style={{
                  marginTop:
                    obj.date ===
                    new Date(
                      orderDetail.requirementsSubmittedAt
                    ).toLocaleDateString()
                      ? "-2rem"
                      : 0,
                }}
              >
                {obj.date !==
                  new Date(
                    orderDetail.requirementsSubmittedAt
                  ).toLocaleDateString() && (
                  <DateTag left={"-1.5rem"} date={obj.date} />
                )}

                {obj.dateWiseMessages.length > 0 &&
                  obj.dateWiseMessages.map((message) =>
                    message.forDelivery ? (
                      <div className="">
                        <div
                          key={message._id}
                          className="flex items-center gap-4 font-semibold text-light_heading"
                        >
                          <div className="p-2 aspect-square bg-pink-100 text-pink-400 rounded-full">
                            <FiPackage />
                          </div>
                          <div className="[&>*]:leading-5 flex-grow pr-6 py-2">
                            <span className="mr-2">
                              {message.sender._id === user._id ? (
                                "You delivered the order"
                              ) : (
                                <>
                                  <Link
                                    to={`/user/${message.sender._id}`}
                                    className="text-primary hover:underline"
                                  >
                                    {message.sender.name}
                                  </Link>
                                  &nbsp; delivered your order
                                </>
                              )}
                            </span>
                            <span className="text-icons font-normal text-xs">
                              <Moment format="MMM DD, H:mm A">
                                {message.createdAt}
                              </Moment>
                            </span>
                          </div>
                        </div>
                        <div className="border mr-6 rounded mt-4">
                          <div className="uppercase py-3 px-4 bg-separator text-light_heading font-semibold">
                            delivery #{message.deliveryNumber}
                          </div>
                          <div className="p-4">
                            <div
                              key={message._id}
                              className="flex items-center gap-4 font-semibold text-light_heading"
                            >
                              <div className="aspect-square rounded-full">
                                <Avatar
                                  avatarUrl={message.sender.avatar.url}
                                  userName={message.sender.name}
                                  width="2rem"
                                  fontSize="1rem"
                                  alt={message.sender.name}
                                />
                              </div>
                              <div className="[&>*]:leading-5 flex-grow pr-6 py-2">
                                <span className="mr-2">
                                  {message.sender._id === user._id ? (
                                    "Me"
                                  ) : (
                                    <>
                                      <Link
                                        to={`/user/${message.sender._id}`}
                                        className="text-primary hover:underline"
                                      >
                                        {message.sender.name}
                                      </Link>
                                      's message
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="ml-12 pb-4">
                              <p className="leading-5 whitespace-pre-wrap pr-6 text-dark_grey max-w-2xl">
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
                                          rel="noopener noreferrer"
                                        >
                                          <LazyVideo
                                            file={file}
                                            maxWidth={
                                              windowWidth > 1024 ? 240 : 160
                                            }
                                            aspectRatio="16/9"
                                          />
                                        </a>
                                      ) : file.type.includes("image") ? (
                                        <a
                                          href={file.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <LazyImage
                                            file={file}
                                            maxWidth={
                                              windowWidth > 1024 ? 240 : 160
                                            }
                                            aspectRatio="16/9"
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
                                      onClick={() =>
                                        downloadFile(file.url, file.name)
                                      }
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
                                        (
                                        {getFileSize(file.size ? file.size : 0)}
                                        )
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : message.forRevision ? (
                      <div className="">
                        <div
                          key={message._id}
                          className="flex items-center gap-4 font-semibold text-light_heading"
                        >
                          <div className="p-2 aspect-square bg-pink-100 text-pink-400 rounded-full">
                            <FiPackage />
                          </div>
                          <div className="[&>*]:leading-5 flex-grow pr-6 py-2">
                            <span className="mr-2">
                              {message.sender._id === user._id ? (
                                "You requested a revision"
                              ) : (
                                <>
                                  <Link
                                    to={`/user/${message.sender._id}`}
                                    className="text-primary hover:underline"
                                  >
                                    {message.sender.name}
                                  </Link>
                                  &nbsp; requested a revision
                                </>
                              )}
                            </span>
                            <span className="text-icons font-normal text-xs">
                              <Moment format="MMM DD, H:mm A">
                                {message.createdAt}
                              </Moment>
                            </span>
                          </div>
                        </div>
                        <div className="border mr-6 rounded mt-4">
                          <div className="uppercase py-3 px-4 bg-separator text-light_heading font-semibold">
                            Revision Request
                          </div>
                          <div className="p-4">
                            <div
                              key={message._id}
                              className="flex items-center gap-4 font-semibold text-light_heading"
                            >
                              <div className="aspect-square rounded-full">
                                <Avatar
                                  avatarUrl={message.sender.avatar.url}
                                  userName={message.sender.name}
                                  width="2rem"
                                  fontSize="1rem"
                                  alt={message.sender.name}
                                />
                              </div>
                              <div className="[&>*]:leading-5 flex-grow pr-6 py-2">
                                <span className="mr-2">
                                  {message.sender._id === user._id ? (
                                    "Me"
                                  ) : (
                                    <>
                                      <Link
                                        to={`/user/${message.sender._id}`}
                                        className="text-primary hover:underline"
                                      >
                                        {message.sender.name}
                                      </Link>
                                      's message
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="ml-12 pb-4">
                              <p className="leading-5 whitespace-pre-wrap pr-6 text-dark_grey max-w-2xl">
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
                                          rel="noopener noreferrer"
                                        >
                                          <LazyVideo
                                            file={file}
                                            maxWidth={
                                              windowWidth > 1024 ? 240 : 160
                                            }
                                            aspectRatio="16/9"
                                          />
                                        </a>
                                      ) : file.type.includes("image") ? (
                                        <a
                                          href={file.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <LazyImage
                                            file={file}
                                            maxWidth={
                                              windowWidth > 1024 ? 240 : 160
                                            }
                                            aspectRatio="16/9"
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
                                      onClick={() =>
                                        downloadFile(file.url, file.name)
                                      }
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
                                        (
                                        {getFileSize(file.size ? file.size : 0)}
                                        )
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="">
                        <div
                          key={message._id}
                          className="flex items-center gap-4 font-semibold text-light_heading"
                        >
                          <div className="aspect-square rounded-full">
                            <Avatar
                              avatarUrl={message.sender.avatar.url}
                              userName={message.sender.name}
                              width="2rem"
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
                        <div className="pt-2 ml-12 pb-4 border-b">
                          <p className="leading-5 whitespace-pre-wrap pr-6 text-dark_grey max-w-2xl">
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
                                      rel="noopener noreferrer"
                                    >
                                      <LazyVideo
                                        file={file}
                                        maxWidth={
                                          windowWidth > 1024 ? 240 : 160
                                        }
                                        aspectRatio="16/9"
                                      />
                                    </a>
                                  ) : file.type.includes("image") ? (
                                    <a
                                      href={file.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <LazyImage
                                        file={file}
                                        maxWidth={
                                          windowWidth > 1024 ? 240 : 160
                                        }
                                        aspectRatio="16/9"
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
                                  onClick={() =>
                                    downloadFile(file.url, file.name)
                                  }
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
                    )
                  )}
              </section>
            ))}

          {orderDetail.buyer._id === user._id &&
            orderDetail.status === "Delivered" && (
              <DeliveryApproval setFileLoading={setFileLoading} />
            )}

          {orderDetail.status !== "Completed" &&
            orderDetail.status !== "Cancelled" && (
              <>
                <section className="relative pl-6 flex flex-col gap-4 pb-4">
                  <div className="flex items-center gap-4 text-light_heading">
                    <div className="aspect-square rounded-full">
                      <Avatar
                        avatarUrl={user.avatar.url}
                        userName={user.name}
                        width="2rem"
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
                  <ChatBox setFileLoading={(val) => setFileLoading(val)} />
                </div>
              </>
            )}

          {orderDetail.status === "Completed" && (
            <>
              <section
                className="relative pl-6 flex flex-col gap-4 pb-12"
                style={{
                  marginTop: orderMessages.some((message) => {
                    return (
                      message.date ===
                      new Date(orderDetail.completedAt).toLocaleDateString()
                    );
                  })
                    ? "-3rem"
                    : "0rem",
                }}
              >
                {!orderMessages.some((message) => {
                  return (
                    message.date ===
                    new Date(orderDetail.completedAt).toLocaleDateString()
                  );
                }) && (
                  <DateTag
                    left={"-1.5rem"}
                    date={new Date(
                      orderDetail.completedAt
                    ).toLocaleDateString()}
                  />
                )}

                <div className="flex items-center gap-4 font-semibold text-light_heading">
                  <div className="p-2 aspect-square bg-purple-200 text-purple-600 rounded-full">
                    <IoDocumentOutline />
                  </div>
                  <div className="[&>*]:leading-5 py-2 pr-6 border-b flex-grow border-b-dark_separator">
                    <span className="mr-2">The order was completed</span>
                    <span className="text-icons font-normal text-xs">
                      <Moment format="MMM DD, H:mm A">
                        {orderDetail.completedAt}
                      </Moment>
                    </span>
                  </div>
                </div>
              </section>

              {orderDetail.buyer._id === user._id &&
                !orderDetail.buyerFeedbackSubmitted && (
                  <Link to={`/orders/${orderDetail._id}/feedback`}>
                    <div className="flex justify-end mx-6">
                      <button className="p-3 px-4 relative bg-primary hover:cursor-pointer hover:bg-primary_hover text-white rounded-sm">
                        Share Feedback
                      </button>
                    </div>
                  </Link>
                )}

              {orderDetail.buyerFeedbackSubmitted &&
                (user._id === orderDetail.buyer._id ||
                  (user._id === orderDetail.seller_id &&
                    orderDetail.sellerFeedbackSubmitted)) && (
                  <section
                    className="relative pl-6 flex flex-col gap-4 pb-16"
                    style={{
                      marginTop:
                        new Date(
                          orderDetail.completedAt
                        ).toLocaleDateString() ===
                        new Date(
                          orderDetail.buyerFeedback.createdAt
                        ).toLocaleDateString()
                          ? "-2rem"
                          : "0rem",
                    }}
                  >
                    {new Date(orderDetail.completedAt).toLocaleDateString() !==
                      new Date(
                        orderDetail.buyerFeedback.createdAt
                      ).toLocaleDateString() && (
                      <DateTag
                        left={"-1.5rem"}
                        date={new Date(
                          orderDetail.buyerFeedback.createdAt
                        ).toLocaleDateString()}
                      />
                    )}
                    <div className="border-b pb-6">
                      <div className="flex items-center gap-4 font-semibold text-light_heading">
                        <div className="p-2 aspect-square bg-orange-100 text-gold rounded-full">
                          <FaStar />
                        </div>
                        <div className="[&>*]:leading-5 flex-grow pr-6 py-2">
                          <span className="mr-2">
                            {orderDetail.buyer._id === user._id ? (
                              "You left a review"
                            ) : (
                              <>
                                <Link
                                  to={`/user/${orderDetail.buyer._id}`}
                                  className="text-primary hover:underline"
                                >
                                  {orderDetail.buyer.name}
                                </Link>
                                &nbsp; gave you a review
                              </>
                            )}
                          </span>
                          <span className="text-icons font-normal text-xs">
                            <Moment format="MMM DD, H:mm A">
                              {orderDetail.buyerFeedback.createdAt}
                            </Moment>
                          </span>
                        </div>
                      </div>
                      <div className="border mr-6 rounded mt-4">
                        <div className="uppercase py-3 px-4 bg-separator text-light_heading font-semibold">
                          {orderDetail.buyer._id === user._id ? (
                            "Your review"
                          ) : (
                            <>
                              <Link
                                to={`/user/${orderDetail.buyer._id}`}
                                className="text-primary hover:underline"
                              >
                                {orderDetail.buyer.name}
                              </Link>
                              's review
                            </>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-4 font-semibold text-light_heading">
                            <div className="aspect-square rounded-full">
                              <Avatar
                                avatarUrl={orderDetail.seller.avatar.url}
                                userName={orderDetail.seller.name}
                                width="2rem"
                                fontSize="1rem"
                                alt={orderDetail.seller.name}
                              />
                            </div>
                            <div className="[&>*]:leading-5 flex-grow pr-6 py-2">
                              <span className="mr-2">
                                {orderDetail.buyer._id === user._id ? (
                                  "Me"
                                ) : (
                                  <>
                                    <Link
                                      to={`/user/${orderDetail.buyer._id}`}
                                      className="text-primary hover:underline"
                                    >
                                      {orderDetail.buyer.name}
                                    </Link>
                                    's message
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="ml-12 pb-4">
                            <p className="leading-5 whitespace-pre-wrap pr-6 text-dark_grey max-w-2xl">
                              {orderDetail.buyerFeedback.comment}
                            </p>
                            <div className="pt-6 max-w-max">
                              {buyerFeedback.map((feedback, index) => (
                                <div
                                  key={index}
                                  className="flex flex-col sm:flex-row gap-1 mb-4 sm:mb-0 sm:gap-8 sm:justify-between"
                                >
                                  <h3 className=" text-light_grey font-semibold sm:mb-4">
                                    {feedback.title}
                                  </h3>
                                  <Rating
                                    size="small"
                                    value={feedback.value}
                                    icon={<FaStar className="text-gold" />}
                                    emptyIcon={
                                      <FaRegStar className="text-gold" />
                                    }
                                    readOnly
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

              {orderDetail.sellerFeedbackSubmitted && (
                <section
                  className="relative pl-6 flex flex-col gap-4 pb-12"
                  style={{
                    marginTop:
                      new Date(
                        orderDetail.sellerFeedback.createdAt
                      ).toLocaleDateString() ===
                      new Date(
                        orderDetail.buyerFeedback.createdAt
                      ).toLocaleDateString()
                        ? "-2rem"
                        : "0rem",
                  }}
                >
                  {new Date(
                    orderDetail.sellerFeedback.createdAt
                  ).toLocaleDateString() !==
                    new Date(
                      orderDetail.buyerFeedback.createdAt
                    ).toLocaleDateString() && (
                    <DateTag
                      left={"-1.5rem"}
                      date={new Date(
                        orderDetail.buyerFeedback.createdAt
                      ).toLocaleDateString()}
                    />
                  )}
                  <div className="pb-6">
                    <div className="flex items-center gap-4 font-semibold text-light_heading">
                      <div className="p-2 aspect-square bg-orange-100 text-gold rounded-full">
                        <FaStar />
                      </div>
                      <div className="[&>*]:leading-5 flex-grow pr-6 py-2">
                        <span className="mr-2">
                          {orderDetail.seller._id === user._id ? (
                            "You left a review"
                          ) : (
                            <>
                              <Link
                                to={`/user/${orderDetail.seller._id}`}
                                className="text-primary hover:underline"
                              >
                                {orderDetail.seller.name}
                              </Link>
                              &nbsp; gave you a review
                            </>
                          )}
                        </span>
                        <span className="text-icons font-normal text-xs">
                          <Moment format="MMM DD, H:mm A">
                            {orderDetail.sellerFeedback.createdAt}
                          </Moment>
                        </span>
                      </div>
                    </div>
                    <div className="border mr-6 rounded mt-4">
                      <div className="uppercase py-3 px-4 bg-separator text-light_heading font-semibold">
                        {orderDetail.seller._id === user._id ? (
                          "Your review"
                        ) : (
                          <>
                            <Link
                              to={`/user/${orderDetail.seller._id}`}
                              className="text-primary hover:underline"
                            >
                              {orderDetail.seller.name}
                            </Link>
                            's review
                          </>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-4 font-semibold text-light_heading">
                          <div className="aspect-square rounded-full">
                            <Avatar
                              avatarUrl={orderDetail.seller.avatar.url}
                              userName={orderDetail.seller.name}
                              width="2rem"
                              fontSize="1rem"
                              alt={orderDetail.seller.name}
                            />
                          </div>
                          <div className="[&>*]:leading-5 flex items-center flex-grow pr-6 py-2">
                            <span className="mr-2">
                              {orderDetail.seller._id === user._id ? (
                                "Me"
                              ) : (
                                <>
                                  <Link
                                    to={`/user/${orderDetail.seller._id}`}
                                    className="text-primary hover:underline"
                                  >
                                    {orderDetail.seller.name}
                                  </Link>
                                  's message
                                </>
                              )}
                            </span>
                            <Rating
                              size="small"
                              value={orderDetail.sellerFeedback.rating}
                              icon={<FaStar className="text-gold" />}
                              emptyIcon={<FaRegStar className="text-gold" />}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="ml-12 pb-4">
                          <p className="leading-5 pr-6 whitespace-pre-wrap text-dark_grey max-w-2xl">
                            {orderDetail.sellerFeedback.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {orderDetail.seller._id === user._id &&
                orderDetail.buyerFeedbackSubmitted &&
                !orderDetail.sellerFeedbackSubmitted && (
                  <section className="relative px-6 flex flex-col gap-4 pb-12">
                    <SellerFeedback />
                  </section>
                )}
            </>
          )}
        </div>
      )}
    </>
  );
};
