import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { CgUserList } from "react-icons/cg";
import UserInfo from "../components/UserInfo";
import Message from "../components/Message";

let socket;

const Chat = ({resetError}) => {
  const { name, room } = useParams();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  /*
  Handle user joining a room
*/
  useEffect(() => {
    socket = io("http://localhost:5000");
    socket.on("connect",()=> '');
    if (!name) return;
    /*
      Emit join message, callback is called from the server 
    */
    socket.emit("join", { name, room }, (error) =>{
      resetError(error)
      navigate('/')
    } );

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [name, room,navigate,resetError]);

  /*
  Handle sending message to the room and get room users
*/
  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });

    socket.on("roomUsers", (data) => {
      if (data.length) {
      const arrange = data.filter(n=> n !== name);
        arrange.unshift(name);
        setUsers(arrange);
      }
    });
  }, [messages,name]);

  /*
  Send message to room
  */
  const sendMessage = (e) => {
    e.preventDefault();
    if (text.trim()) {
      socket.emit("sendText", text, (data) => {
        if (data.error) {
         
        }
        setText("");
      });
    }
  };

  return (
    <div className="center">
    <div className="chat">
      <div className="users">
        <h3 className="center">
          <CgUserList />
          <span>Active users ({users.length}) </span>
        </h3>
        <div className="user-list">
          {users.length &&
            users.map((user) => <UserInfo key={user} user={user} />)}
        </div>
      </div>
      <div className="cont">
        <h3 className="center">
          <span>{room.toLowerCase()}</span>
        </h3>
        <div className="texts">
          {messages.length &&
            messages.map((message, i) => (
              <Message key={i} message={message} name={name} />
            ))}
        </div>
        <form className="chat_form" onSubmit={sendMessage}>
          <input
            type="text"
            value={text}
            placeholder="send message"
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit">
            <FaArrowRight />
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Chat;
