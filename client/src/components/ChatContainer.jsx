import { ChatState, SERVERURL } from "../context/ChatProvider"
import { Avatar, IconButton } from "@mui/material"
import { Add, Mic, MoreVert, Search, SentimentSatisfied } from '@mui/icons-material'
import { getSender, getSenderImg } from '../config/ChatLogic'
import { useEffect, useState } from "react"
import GroupInfo from "./GroupInfo"
import { toast } from "react-toastify"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Messages from "./Messages"
import io from 'socket.io-client'

const ENDPOINT = SERVERURL;
let socket, selectedChatCompare;

const ChatContainer = ({ setFetchAgain, fetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState()
  const [menu, setMenu] = useState(false);
  const [groupInfo, setGroupInfo] = useState(false)
  const [message, setMessage] = useState([])
  const [newMessage, setNewMessage] = useState([])
  const [sockectConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const navigate = useNavigate()

  const handleExit = async (user1) => {
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
        `/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      navigate("/chats")

    } catch (error) {
      toast(error.message);
    }
  }

  const fetchMessages = async() => {

    if(!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const {data} = await axios.get(`/message/${selectedChat._id}`, config)
      setMessage(data)
      socket.emit('join chat', selectedChat._id)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true))
    socket.on('typing', () => setIsTyping(true))
    socket.on('stop typing', () => setIsTyping(false))
    return () => {
      socket.disconnect()
    }

  }, [])

  useEffect(() => {
    fetchMessages()

    selectedChatCompare = selectedChat;
  }, [selectedChat])

  console.log(notification, '12345678')

  useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => {
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      }else{
        setMessage([...message, newMessageRecieved])
      }
    });
  })

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id)
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          }
        }
        e.preventDefault()

        setNewMessage("")

        const { data } = await axios.post(`=/message`, {
          content: newMessage,
          chatId: selectedChat._id,
        }, config)

 
        socket.emit('new message', data)
        setMessage([...message, data])
      } catch (error) {
        toast.error(error.message)
      }
    }
  }

  const typingHandler = (e) => {
    setNewMessage(e.target.value)

    if(!sockectConnected) return

    if(!typing) {
      setTyping(true)
      socket.emit("typing", selectedChat._id)
    }
    let lastTypingTime = new Date().getTime()
    let timerLength = 3000
    setTimeout(() => {
      var timeNow = new Date().getTime()
      var timeDiff = timeNow - lastTypingTime

      if(timeDiff >= timerLength && typing){
        socket.emit("stop typing", selectedChat._id)
        setTyping(false)
      }
    }, timerLength)
  }
  return (
    <>
      {selectedChat
        ? <div className='flex-[0.7]'>
          <div className="flex justify-between items-center bg-[#202c33]">
            <div className="flex items-center gap-3 py-1 px-5">
              <IconButton>
                <Avatar src={!selectedChat.isGroupChat ? getSenderImg(user, selectedChat.users) : selectedChat.groupAdmin.pic} />
              </IconButton>
              <div className="flex flex-col items-start justify-center">
                <span className="text-base text-gray-100 font-[400]">{!selectedChat.isGroupChat ? getSender(user, selectedChat.users) : selectedChat.chatName}</span>

                {isTyping? <span className="text-sm text-[#00DA60] font-[400]">typing...</span>: ""}
              </div>
            </div>

            <div>
              <IconButton sx={{ fontSize: "23px", color: "#aebac1", marginRight: '8px' }}>
                <Search />
              </IconButton>
              <IconButton sx={{ fontSize: "23px", color: "#aebac1", marginRight: '18px' }} onClick={() => setMenu(!menu)}>
                <MoreVert />
              </IconButton>
            </div>
            {menu && (
              <>
                {selectedChat.isGroupChat ?
                  <div className="absolute flex flex-col justify-center items-start text-sm py-2 rounded-sm font-[400] z-20 top-20 right-10 bg-[#233138] animate-dropdown open">
                    <span className="cursor-pointer w-[150px] py-2 px-6 hover:bg-[#111b21]" onClick={() => setGroupInfo(!groupInfo)}>
                      Group info
                    </span>
                    <span onClick={() => handleExit(user)} className="cursor-pointer w-[150px] py-2 px-6 hover:bg-[#111b21]">
                      Exit
                    </span>
                  </div>
                  : ""}
              </>
            )}
          </div>
          <div className="absolute flex flex-col h-[77vh] w-[68.5%] overflow-y-scroll p-10 scrollbar-thin scrollbar-thumb-[#374045]">

            <Messages messages={message} />
          </div>

          <img className="gradient" src="assets/whatsappbg.jpg" alt="" />
          <div className="bg-[#202c33] py-3 px-5 flex items-center gap-4">
            <IconButton>
              <Add sx={{ fontSize: "23px", color: "#aebac1" }} />
            </IconButton>
            <form onKeyDown={sendMessage} className="bg-[#2a3942] py-2 rounded-md flex-1 items-center">
              <input value={newMessage} onChange={typingHandler} className="text-sm w-[800px] border-none p-1.9 outline-none bg-transparent placeholder:text-base ml-8 placeholder:text-gray-400 placeholder:font-[400]" type="text" placeholder="Type a message" />
              <SentimentSatisfied sx={{ fontSize: "23px", color: "#aebac1", marginRight: '10px' }} />
            </form>
            <IconButton>
              <Mic sx={{ fontSize: "23px", color: "#aebac1" }} />
            </IconButton>
          </div>
        </div> : <img className='w-[1070px] border-b-4 border-[#008069]' src='assets/homeimg.png' />}
      {groupInfo ? <>
        <GroupInfo fetchMessages={fetchMessages} handleFunction={() => setGroupInfo(!groupInfo)} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </> : ""}
    </>
  )
}

export default ChatContainer