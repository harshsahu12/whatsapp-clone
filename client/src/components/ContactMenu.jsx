import { ArrowBack } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider.jsx";
import axios from "axios";
import UserListItem from "./UserListItem";
import { toast } from "react-toastify";
import { SERVERURL } from "../config/helper"

const ContactMenu = ({ onClick }) => {
  const [allUser, setAllUser] = useState([]);

  const {
    setSelectedChat,
    user,
    chats,
    setChats,
  } = ChatState();

  const handleAllUser = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${SERVERURL}/user`, config);

      // Filter out the logged-in user
      const filteredUsers = data.filter(u => u._id !== user._id);

      setAllUser(filteredUsers);

    } catch (error) {
      toast.error(error.message);
    }
  };

  const accessChat = async (userId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`${SERVERURL}/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      onClick();
    } catch (error) {
      toast.log(error.message);
    }
  };

  useEffect(() => {
    handleAllUser();
  }, []);

  return (
    <div className="flex-[0.3] flex-col justify-center items-center border-r border-gray-800 animate-dropdown open">
      <div className="flex items-center pt-[60px] pb-[10px] pl-[20px] text-xl text-gray-300 font-[500] bg-[#202c33] gap-5">
        <IconButton onClick={onClick}>
          <ArrowBack sx={{ fontSize: "20px", color: "lightgray" }} />
        </IconButton>
        Add user to chat
      </div>
      <div className="flex flex-col items-center justify-center my-10">
        <div className="mb-4">
          <input
            type="text"
            className="outline-none placeholder:text-base text-[#aebac1] w-[350px] font-[350] bg-transparent border-b-[0.1px] border-gray-700"
            placeholder="Type user name"
          />
        </div>
        <div className="flex flex-col h-[69vh] overflow-y-scroll scrollbar-thin scrollbar-thumb-[#374045]">
        {allUser.map((user) => (
          <UserListItem
            key={user._id}
            user={user}
            handleFunction={() => accessChat(user._id)}
          />
        ))}
        </div>
      </div>
    </div>
  );
};

export default ContactMenu;
