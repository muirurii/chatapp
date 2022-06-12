import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {FaArrowRight} from 'react-icons/fa';
import {CgUserList} from 'react-icons/cg';
import UserInfo from '../components/UserInfo'

let socket;

const Chat = () => {
  const { name, room } = useParams();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  /*
  Handle user joining a room
*/
  useEffect(() => {
    socket = io("http://localhost:5000");
    socket.on("connect", () => console.log(socket.id));
    socket.emit("join", { name, room }, (error) => console.log(error));
    // socket.emit('')
    socket.on('roomUsers',(data)=>{
      if(data.length){
        setUsers(data);
      }
    })
    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [name, room]);

  /*
  Handle sending message to the room
*/


  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages,message]);
      console.log(message);
    });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (text) {
      socket.emit("sendText", text, (data) => {
        if(data.error){
          console.log(data.message);
        }
        setText("")
      });
    }
  };

  return (
    <div className="chat">
      <div className="users">
        <h3 className="center"><CgUserList/><span>Active users ({users.length}) </span></h3>
      <div className="user-list">
      {users.length && users.map(user=> <UserInfo key={user} user={user} />)}
      </div>
      </div>
     <div className="cont">
      <h3 className="center"><span>{room.toLowerCase()}</span></h3>
        <div className="texts">
          {messages.length && messages.map((message,i) => {
            return <p key={i} className={`${message.user === name ? 'me' : message.user === 'admin' ? 'admin' : 'other'}`}>
                {message.message}
                {message.user !== 'admin' && <>
                <span className="sender">{message.user}</span>
                {/* <span className="time">{new Date(message.time).toLocaleString('en-US')}</span> */}
                </>}
                </p>
          })}
        </div>
        <form className="chat_form" onSubmit={sendMessage}>
          <input
            type="text"
            value={text}
            placeholder="send message"
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit"><FaArrowRight /></button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
