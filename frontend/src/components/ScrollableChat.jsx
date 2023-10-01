/* eslint-disable react/prop-types */
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../configs/ChatLogic";
import { ChatState } from "../Context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";
const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, i) => (
          <div
            key={message._id}
            style={{ display: "flex", alignItems: "center" }}
          >
            {(isSameSender(messages, message, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip
                label={message.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt={"7px"}
                  mr={1}
                  size={"sm"}
                  cursor={"pointer"}
                  name={message.sender.name}
                  src={message.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  message.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, message, i, user._id),
                marginTop: isSameUser(messages, message, i) ? 3 : 10,
              }}
            >
              {message.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
