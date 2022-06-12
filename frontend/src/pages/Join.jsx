import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {FaComments} from 'react-icons/fa'

const Join = () => {
  const [details, setDetails] = useState({ name: "", room: "" });
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!details.name || !details.room) return;
    navigate(`/chat/${details.name}/${details.room}`);
  };
  return (
    <div className="join center">
      <div>
        <h1>Join a chatroom <FaComments /></h1>
        <label htmlFor="name">username</label>
        <input
          type="text"
          id="name"
          placeholder="join room as"
          onChange={(e) => setDetails({ ...details, name: e.target.value })}
        />
        <label htmlFor="room">room</label>
        <input
          type="text"
          id="room"
          placeholder="room you want to join"
          onChange={(e) => setDetails({ ...details, room: e.target.value })}
        />
        <button onClick={handleJoin}>Join</button>
      </div>
    </div>
  );
};

export default Join;
