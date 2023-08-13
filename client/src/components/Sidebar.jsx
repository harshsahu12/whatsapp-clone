import { Avatar, Badge, IconButton } from "@mui/material";
import {
  CircleOutlined,
  FilterList,
  Groups,
  Message,
  MoreVert,
  Search,
} from "@mui/icons-material";
import { useState } from "react";
import ProfileMenu from "./ProfileMenu";
import ContactMenu from "./ContactMenu";
import { useNavigate } from 'react-router-dom'
import { ChatState } from "../context/ChatProvider";
import MyChats from "./MyChats";
import GroupChat from "./GroupChat";
import { getSender } from "../config/ChatLogic";

const Sidebar = ({ fetchAgain }) => {
  const [menu, setMenu] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isGroupChatOpen, setIsGroupChatOpen] = useState(true)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const { user, setSelectedChat, notification, setNotification } = ChatState()

  const navigate = useNavigate()

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <>
      {isChatOpen ? (
        <>
          {isProfileMenuOpen ? (
            <>
              {isGroupChatOpen ? <div className="flex-[0.3] flex-col justify-center items-center border-r border-gray-800">
                <div className="flex justify-between items-center py-1 px-2.5 bg-[#202c33]">
                  <IconButton
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <Avatar src={user?.pic} sx={{ width: "40px", height: '40px' }} />
                  </IconButton>
                  <div className="flex justify-between items-center gap-3">
                    <IconButton>
                      <Groups sx={{ fontSize: "23px", color: "#aebac1" }} />
                    </IconButton>
                    <IconButton>
                      <CircleOutlined
                        sx={{ fontSize: "23px", color: "#aebac1" }}
                      />
                    </IconButton>
                    {notification.map((notif) => (
                      <>
                        {isNotificationOpen && (
                          <div className="absolute flex flex-col justify-center items-start text-sm py-2 z-0 rounded-sm font-[400] top-20 ml-3 bg-[#233138] animate-dropdown open" key={notif._id} onClick={() => {
                            setSelectedChat(notif.chat)
                            setNotification(notification.filter((n) => n !== notif))
                          }}>
                            <span className="cursor-pointer w-[180px] py-2 px-6 hover:bg-[#111b21]" onClick={() => setIsChatOpen(!isChatOpen)}>
                              {notif.chat.isGroupChat ? `New message in ${notif.chat.chatName}` : `New Message from ${getSender(user, notif.chat.users)}`}
                            </span>
                          </div>
                        )}
                      </>
                    ))}
                    <div className="cursor-pointer" onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
                      <Badge color="success" badgeContent={notification.length}>
                        <Message sx={{ fontSize: "23px", color: "#aebac1" }} />
                      </Badge>
                    </div>

                    <IconButton onClick={() => setMenu(!menu)}>
                      <MoreVert sx={{ fontSize: "23px", color: "#aebac1" }} />
                    </IconButton>
                    {menu && (
                      <div className="absolute flex flex-col justify-center items-start text-sm py-2 z-0 rounded-sm font-[400] top-20 ml-3 bg-[#233138] animate-dropdown open">
                        <span className="cursor-pointer w-[180px] py-2 px-6 hover:bg-[#111b21]" onClick={() => setIsChatOpen(!isChatOpen)}>
                          New chat
                        </span>
                        <span className="cursor-pointer w-[180px] py-2 px-6 hover:bg-[#111b21]" onClick={() => setIsGroupChatOpen(!isGroupChatOpen)}>
                          New group
                        </span>
                        <span
                          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                          className="cursor-pointer w-[180px] py-2 px-6 hover:bg-[#111b21]"
                        >
                          Profile
                        </span>
                        <span onClick={logoutHandler} className="cursor-pointer w-[180px] py-2 px-6 hover:bg-[#111b21]">
                          logout
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center my-2">
                  <div className="flex items-center py-2 w-[390px] m-auto bg-[#202c33] rounded-md">
                    <Search
                      sx={{
                        fontSize: "20px",
                        color: "#aebac1",
                        marginLeft: "15px",
                      }}
                    />
                    <input
                      className="w-[200px] text-sm border-none outline-none bg-transparent placeholder:text-sm ml-8 placeholder:text-gray-400 placeholder:font-[400]"
                      type="text"
                      placeholder="Search or start new chat"
                    />
                  </div>
                  <FilterList
                    sx={{
                      fontSize: "23px",
                      color: "#aebac1",
                      marginRight: "10px",
                    }}
                  />
                </div>
                <MyChats fetchAgain={fetchAgain} />
              </div> : <GroupChat onClick={() => setIsGroupChatOpen(!isGroupChatOpen)} />}
            </>
          ) : (
            <ProfileMenu onClick={() => setIsProfileMenuOpen(ProfileMenu)} />
          )}
        </>
      ) : (
        <ContactMenu onClick={() => setIsChatOpen(!isChatOpen)} />
      )}
    </>
  );
};

export default Sidebar;
