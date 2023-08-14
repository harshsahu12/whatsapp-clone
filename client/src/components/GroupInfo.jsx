import { Check, Close, FiberManualRecord, Search } from "@mui/icons-material"
import { Avatar, IconButton } from "@mui/material"
import UserAdded from "./UserAdded"
import { ChatState } from "../context/ChatProvider"
import { useState } from "react"
import UserListItem from "./UserListItem"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom"
import { SERVERURL } from "../config/helper"

const GroupInfo = ({ handleFunction, fetchAgain, setFetchAgain, fetchMessages }) => {
    const { user, selectedChat, setSelectedChat } = ChatState()
    const [groupChatName, setGroupChatName] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [search, setSearch] = useState('');
    const [input, setInput] = useState(false)

    const navigate = useNavigate()

    const handleRemove = async(user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast("Only admins can remove someone!");
            return;
          }
      
          try {
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            };
            const { data } = await axios.put(
              `${SERVERURL}/chat/groupremove`,
              {
                chatId: selectedChat._id,
                userId: user1._id,
              },
              config
            );
      
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages()
            navigate("/chats")
          } catch (error) {
            toast(error.message);
          }
          setGroupChatName("");
    };

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
          toast("User Already in group!");
          return;
        }
    
        if (selectedChat.groupAdmin._id !== user._id) {
          toast("Only admins can add someone!");
          return;
        }
    
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.put(
            `${SERVERURL}/chat/groupadd`,
            {
              chatId: selectedChat._id,
              userId: user1._id,
            },
            config
          );
    
          setSelectedChat(data);
          setFetchAgain(!fetchAgain);
        } catch (error) {
          toast(error.message);
        }
        setGroupChatName("");
      };

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.put(
            `${SERVERURL}/chat/rename`,
            {
              chatId: selectedChat._id,
              chatName: groupChatName,
            },
            config
          );
  
          setSelectedChat(data);
          setFetchAgain(!fetchAgain);
        } catch (error) {
          toast(error.message);
        }
        setGroupChatName("");
     }

    const handleSearch = async (query) => { 
        setSearch(query);
        if (!query) {
          return;
        }
    
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.get(`${SERVERURL}/user?search=${search}`, config);
  
          setSearchResult(data);
        } catch (error) {
          toast(error.message);
        }
    }

    return (
        <div className="w-[450px] absolute flex-col left-3 top-15 bg-[#111b21] animate-dropdown open">

            <div className="flex py-3 px-4 justify-between items-center bg-[#202c33] gap-3">
                <div>
                    <IconButton sx={{ fontSize: "23px", color: "#aebac1" }} onClick={handleFunction}>
                        <Close />
                    </IconButton>
                    <span className="font-[400] text-base">Group info</span>
                </div>
                <div onClick={handleFunction}>
                    <span onClick={() => handleRemove(user)} className="text-base font-[500] text-[#0a6d66] mr-4 py-1 px-4 border rounded-full cursor-pointer border-[#0a6d66]">Leave</span>
                </div>
            </div>
            <form className="h-[88vh] overflow-y-scroll scrollbar-thin scrollbar-thumb-[#374045]">
                <div className="flex flex-col items-center justify-center mt-10 gap-3">
                    <Avatar src={!selectedChat.isGroupChat ? selectedChat.users[1].pic : selectedChat.groupAdmin.pic} sx={{ width: "190px", height: "190px", cursor: 'pointer' }} />
                    <div className="flex flex-col items-center justify-cente gap-1">
                        <span className="flex items-center">
                            <form>
                                <input value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} className="border-none outline-none bg-transparent w-[120px] text-2xl font-[400] text-white placeholder:text-2xl placeholder:font-[400] placeholder:text-white" type="text" placeholder={selectedChat.chatName} />
                                <IconButton type="submit" onClick={handleRename}>
                                    <Check sx={{ color: '#aebac1', width: '25px', height: '25px' }} />
                                </IconButton>
                            </form>
                        </span>
                        <span className="text-gray-400 font-[400] text-base">Group <FiberManualRecord sx={{ fontSize: '5px' }} /> 23 participants</span>
                    </div>
                </div>
                <hr className="border-4 border-[#0c1317] mt-4" />
                <div className="flex justify-between items-center mt-3">
                    <span className="text-base text-gray-400 font-[400] ml-7">Created by {selectedChat.groupAdmin.name}</span>
                </div>
                <hr className="border-4 border-[#0c1317] mt-4" />
                <div className="flex justify-between items-center mt-3">
                    <span className="text-base text-gray-400 font-[400] ml-7">Participants</span>
                    {input && <input onChange={(e) => handleSearch(e.target.value)} type="text" className="outline-none bg-transparent border border-none rounded-md animate-dropdown open" placeholder="Search user to add" />}
                    <IconButton sx={{ fontSize: "23px", color: "#aebac1" }} onClick={() => setInput(!input)}>
                        <Search />
                    </IconButton>
                </div>
                <div className="grid grid-cols-3 my-2">
                    {selectedChat.users.map((u) => (
                        <UserAdded
                            key={u._id}
                            user={u}
                            handleFunction={() => handleRemove(u)}
                        />
                    ))}
                </div>
                {searchResult?.slice(0, 3).map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))}
            </form>
        </div>
    )
}

export default GroupInfo