import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
function Home() {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!username || !roomName) return alert("Enter username and room");

    navigate("/chat", {
      state: {
        username,
        roomName,
      },
    });
  };
  return (
    <>
      <div className="text-blue-500 font-bold bg-yellow-300 rounded-md w-1/2 mx-auto mt-10 p-5 space-y-5 ">
        <div className="">
          <span>
            <label htmlFor="username">Username:</label>
          </span>
          <span className="ml-2">
            <input
              type="text"
              id="username"
              className="border border-black rounded-md focus:outline-none px-2 focus:ring-2"
              placeholder="Enter Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </span>
        </div>
        <div className="">
          <span>
            <label htmlFor="roomName">Room Name:</label>
          </span>
          <span className="ml-2">
            <input
              type="text"
              id="roomName"
              className="border border-black rounded-md focus:outline-none px-2 focus:ring-2"
              placeholder="Enter Room Name"
              onChange={(e) => setRoomName(e.target.value)}
            />
          </span>
        </div>
        <div>
          <button
            className="rounded-sm bg-blue-300 px-2 border border-blue-500 text-black hover:bg-red-500 hover:text-white hover:scale-105 transition-all duration-300 "
            onClick={handleJoin}
          >
            Join
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
