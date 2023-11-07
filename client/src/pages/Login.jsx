import { useNavigate } from "react-router-dom";
import Forms from "../components/Forms";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"))

    if(user) navigate("/chats")
  })
  return (
    <div className="h-screen w-full flex flex-col items-center">
      <div className="w-[1000px] z-10">
        <div className="flex items-center gap-4 py-7">
            <img className="w-9" src="assets/whatsapp.png" alt="" />
            <span className="text-[15px] uppercase font-[500] tracking-tight text-white">whatsapp web</span>
        </div>
        <div className="bg-white flex flex-col shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] rounded-sm scrollbar-none">
            <div className="flex justify-between items-center p-20">
                <Forms />
                <img className="w-[300px]" src="assets/astronot.png" alt="" />
            </div>
            <div className="bg-[#f9f9fa] p-10 gap-4 flex flex-col justify-center items-center">
                <h4 className="text-3xl font-thin text-black">Explore</h4>
                <a className="hover:underline font-normal text-[#4fa797] gap-4 flex flex-col items-center" target="_blank" href="https://my-sanity-portfolio-harshsahu12.vercel.app">
                    <span>Check out more of my prev projects</span>
                    <video typeof="video/mp4" loop className="w-[400px]" src="assets/portfolio.mp4" alt="" />
                </a>
            </div>
        </div>
      </div>
      <div className="h-[220px] w-full absolute bg-[#00a884]" />
    </div>
  );
};

export default Login;
