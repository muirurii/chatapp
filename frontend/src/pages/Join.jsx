import { useState } from "react";
import {useNavigate} from 'react-router-dom';

const Join = () => {

  const[details,setDetails] = useState({name:'',room:''});
  const navigate = useNavigate();

  const handleJoin = ()=>{
    if(!details.name || !details.room) return;
    navigate(`/chat/${details.name}/${details.room}`)
  }
  return (
    <div className="join center">
      <div>
        <h1>Join</h1>
        <label htmlFor="">Name</label>
        <input type="text" onChange={(e)=> setDetails({...details,name:e.target.value})} />
        <label htmlFor="">Room</label>
        <input type="text" onChange={(e)=> setDetails({...details,room:e.target.value})} />
        <button onClick={handleJoin}>Join</button>
      </div>
    </div>
  )
}

export default Join;