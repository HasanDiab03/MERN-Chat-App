/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  MenuDivider,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import { UserListItem } from "../UserAvatar/UserListItem";
import { getSender } from "../../configs/ChatLogic";
import NotificationBadge, { Effect } from "react-notification-badge";

const SideDrawer = () => {
  const { user } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const {
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };


  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter Something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: "Failed to Load Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((chat) => chat._id === data._id))
        setChats([...chats, data]);
      setSelectedChat(data);
      setLoading(false);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoadingChat(false);
    }
  };

  const handleNotification = async (notif) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete(`/api/notification/${notif._id}`, config);
      setSelectedChat(notif.message.chat);
      setNotifications(notifications.filter((n) => n._id !== notif._id));
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: "Failed to remove notification",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px={"4"}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"Work sans"}>
          Chatty
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notifications.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize={"2xl"} margin={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notifications.length && "No New Messages"}
              {notifications.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => handleNotification(notif)}
                >
                  {notif.message.chat.isGroupChat
                    ? `New Message in ${notif.message.chat.chatName}`
                    : `New Message from ${getSender(
                        user,
                        notif.message.chat.users
                      )}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton p={1} as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottom={"1px"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
