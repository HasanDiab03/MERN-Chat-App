import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { useState } from "react";
const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState();
  return (
    <div style={{ width: "100%" }}>
      <SideDrawer />
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        width={"100%"}
        h={"91.5vh"}
        p={"10px"}
      >
        <MyChats fetchAgain={fetchAgain} />
        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    </div>
  );
};

export default ChatPage;
