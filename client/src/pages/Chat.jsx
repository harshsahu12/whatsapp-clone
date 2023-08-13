import { useState } from "react"
import ChatContainer from "../components/ChatContainer"
import Sidebar from "../components/Sidebar"
import { ChatState } from "../context/ChatProvider"

const Chat = () => {
  const { user } = ChatState()
  const [fetchAgain, setFetchAgain] = useState()
  return (
    <div className="flex justify-center h-[95vh] w-[1500px] bg-transparent">
      {user && <Sidebar fetchAgain={fetchAgain} />}
      {user && <ChatContainer fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
    </div>
  )
}

export default Chat