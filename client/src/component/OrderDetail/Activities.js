import React, { useState, useEffect } from "react";
import { DateTag } from "../DateTag";
import axios from "axios";
import { useParams } from "react-router-dom";

export const Activities = ({ orderDetail }) => {
  const params = useParams();

  const [orderMessages, setOrderMessages] = useState([]);

  useEffect(() => {
    getOrderMessages();
  }, []);

  const getOrderMessages = async () => {
    try {
      const { data } = await axios.get(`/message/order/${params.id}`);
      // console.log(data);

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
    let dateWiseMessages = new Map();

    messages = [
      {
        createdAt: "2023-02-15T13:38:35.269Z",
        message: {
          text: "Hello",
        },
      },
      {
        createdAt: "2023-02-15T12:38:55.269Z",
        message: {
          text: "how are hiou",
        },
      },
      {
        createdAt: "2023-02-13T12:12:55.269Z",
        message: {
          text: "welcome",
        },
      },
      {
        createdAt: "2023-02-17T12:38:45.269Z",
        message: {
          text: "to my palace",
        },
      },
    ];

    for (const message of messages) {
      const date = new Date(message.createdAt).toISOString().substr(0, 10);
      if (dateWiseMessages.has(date)) {
        dateWiseMessages.get(date).push(message);
      } else {
        dateWiseMessages.set(date, [message]);
      }
    }

    if (deliveries) {
      for (const delivery of deliveries) {
        const date = new Date(delivery.createdAt).toDateString();
        if (dateWiseMessages.has(date)) {
          dateWiseMessages.get(date).push(delivery);
        } else {
          dateWiseMessages.set(date, [delivery]);
        }
      }
    }

    if (revisions) {
      for (const revision of revisions) {
        const date = new Date(revision.createdAt).toDateString();
        if (dateWiseMessages.has(date)) {
          dateWiseMessages.get(date).push(revision);
        } else {
          dateWiseMessages.set(date, [revision]);
        }
      }
    }

    dateWiseMessages = new Map([...dateWiseMessages.entries()].sort());
    console.log(dateWiseMessages);
    return dateWiseMessages;
  };

  return (
    <div className="relative h-screen p-8">
      <DateTag date={"2023-08-15T12:38:55.269Z"} />
    </div>
  );
};
