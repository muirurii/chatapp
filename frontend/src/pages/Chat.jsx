import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
let socket;

const Chat = () => {
  const { name, room } = useParams();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  /*
  Handle user joining a room
*/
  useEffect(() => {
    socket = io("http://localhost:5000");
    // socket.connect()
    socket.on("connect", () => console.log(socket.id));
    socket.emit("join", { name, room }, (error) => console.log(error));

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
    });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (text) {
      socket.emit("sendText", text, () => setText(""));
    }
  };

  return (
    <div className="chat">
      <h1>Chatroom</h1>
      <div className="cont">
        <div className="texts">
          {messages.length && messages.map(message => {
            return <div key={Math.floor(Math.random() * 4444)}>
              <p>{message.message}</p>
            </div>
          })}
        </div>

        <form className="chat_form" onSubmit={sendMessage}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
