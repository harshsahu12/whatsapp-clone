import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Chat from "./pages/Chat";

function App() {
  return (
    <div className="flex flex-col justify-center items-center bg-[#111b21] text-[#d0e3e7] h-screen overflow-y-scroll scrollbar-thin z-50 animate-dropdown open">
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/chats" element={<Chat />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
