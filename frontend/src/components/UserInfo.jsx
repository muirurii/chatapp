import {FaUser} from 'react-icons/fa';

const UserInfo = ({user}) => {
  return (
    <div className="user">
        <FaUser />
        <p>{user}</p>
    </div>
  )
}

export default UserInfo