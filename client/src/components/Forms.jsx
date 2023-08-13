import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SERVERURL } from "../config/helper";

const Forms = () => {
  const [signIn, setSignIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) {
      toast.warn("Please Fill all the Feilds");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${SERVERURL}/user`,
        {
          name,
          email,
          password,
          pic,
        },
        config
      );

      toast.success("Registration successfull");
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const postDetails = (pics) => {
    if (pics === undefined) {
      toast.warn("Please Select an Image!");
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/jpg") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "fiverr");
      data.append("cloud_name", "dkx1fkobd");
      fetch(`https://api.cloudinary.com/v1_1/dkx1fkobd/image/upload`, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast.warn("Please Select an Image!");

      return;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.warn("Please Fill all the Feilds");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${SERVERURL}/user/login`,
        { email, password },
        config
      );

      toast.success("Login Successful");
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div>
      {signIn ? (
        <div>
          <h2 className="text-3xl font-thin mb-5 text-black">Register</h2>
          <form
            onSubmit={handleRegister}
            className="flex flex-col space-y-2 w-[400px] lg:w-fit mx-auto"
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="contactInput"
              type="text"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="contactInput"
              type="email"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="contactInput"
              type="password"
            />
            <input
              accept="image/*"
              onChange={(e) => postDetails(e.target.files[0])}
              className="contactInput"
              type="file"
            />
            {pic && <img src={pic} alt="Uploaded" style={{ width: "100px", height: "100px" }} />}
            <button
              type="submit"
              className="bg-[#00a884] py-2 rounded-md text-white font-normal text-lg"
            >
              Register
            </button>
          </form>
          <h4 className="mt-2 text-black">
            <span>Already have an account? </span>
            <span
              onClick={() => setSignIn(false)}
              className="hover:underline text-[#00a884] cursor-pointer"
            >
              Login
            </span>
          </h4>
        </div>
      ) : (
        <div>
          <h2 className="text-3xl font-thin mb-5 text-black">Login</h2>
          <form
            onSubmit={handleLogin}
            className="flex flex-col space-y-2 w-[400px] lg:w-fit mx-auto"
          >
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="contactInput"
              type="email"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="contactInput"
              type="password"
            />
            <button
              type="submit"
              className="bg-[#00a884] py-2 rounded-md text-white font-normal text-lg"
            >
              Login
            </button>
          </form>
          <h4 className="mt-2 text-black">
            <span>New to Whatsapp? </span>
            <span
              onClick={() => setSignIn(true)}
              className="hover:underline text-[#00a884] cursor-pointer"
            >
              Register
            </span>
          </h4>
        </div>
      )}
    </div>
  );
};

export default Forms;
