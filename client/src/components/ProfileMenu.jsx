import { ArrowBack } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import React from "react";
import { ChatState } from "../context/ChatProvider.jsx";

const ProfileMenu = ({ onClick }) => {
    const { user } = ChatState()
  return (
    <div className="flex-[0.3] flex-col justify-center items-center border-r border-gray-800 animate-dropdown open">
      <div className="flex items-center pt-[60px] pb-[10px] pl-[20px] text-xl text-gray-300  font-[500] bg-[#202c33] gap-5">
        <IconButton onClick={onClick}>
            <ArrowBack sx={{ fontSize: "20px", color: "lightgray" }} />
        </IconButton>
        Profile
      </div>
      <div className="flex flex-col items-center justify-center space-y-14 my-7">
        <Avatar src={user?.pic} sx={{ width: "190px", height: "190px", cursor: 'pointer' }} />
        <div className="flex flex-col items-start gap-8 w-[390px] text-[#aebac1">
            <div className="flex flex-col gap-3">
                <span className="text-[16px] text-[#0a6d66]">Your name</span>
                <span>{user?.name}</span>
            </div>
            <div className="flex flex-col gap-3">
                <span className="text-[16px] text-[#0a6d66]">Your email</span>
                <span>{user?.email}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileMenu;
