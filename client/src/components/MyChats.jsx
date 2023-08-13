import { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import axios from 'axios'
import { Avatar } from '@mui/material'
import { getSender, getSenderImg } from "../config/ChatLogic"
import { toast } from 'react-toastify'

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState()
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState()

  const fetchChats = async () => {
    try {
      if (!user || !user.token) {
        // Handle the case where the user or token is null or undefined
        console.error("User or token is null or undefined.")
        return
      }

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/chat`, config);
      setChats(data);

    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();

  }, [fetchAgain]);

  return (
    <div className='flex flex-col h-[80vh] overflow-y-scroll scrollbar-thin scrollbar-thumb-[#374045]'>
      {chats?.map((chat) => (
        <div key={chat._id} onClick={() => setSelectedChat(chat)} className={`flex justify-between items-center py-2 px-3 hover:bg-[#2a3942] cursor-pointer ${selectedChat === chat ? 'bg-[#2a3942]' : 'transparent'}`}>
          <div className='flex justify-between items-center gap-3'>
            <Avatar src={!chat.isGroupChat ? getSenderImg(user, chat.users) : chat.groupAdmin.pic} sx={{ width: "60px", height: '60px' }} />
            <div className='flex flex-col gap-0.6'>
              <span className='text-white text-base'>
                {!chat.isGroupChat
                  ? getSender(loggedUser, chat.users)
                  : chat.chatName}
              </span>
              <span className={`text-sm ${selectedChat === chat ? "text-white" : "text-gray-400"} font-[400]`}></span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MyChats
