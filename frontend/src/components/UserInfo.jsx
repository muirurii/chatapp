import {FaUserCircle} from 'react-icons/fa';

const UserInfo = ({user}) => {
  return (
    <div className="user">
        <FaUserCircle />
        <p>{user}</p>
    </div>
  )
}

export default UserInfo