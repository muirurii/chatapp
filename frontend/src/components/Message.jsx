const Message = ({message,name}) => {
  return (
    <p className={`${message.user === name ? 'me' : message.user === 'admin' ? 'admin' : 'other'}`}>
            {message.message}
                {message.user !== 'admin' && <>
                <span className="sender">{message.user === name ? 'you': message.user}</span>
                {/* <span className="time">{new Date(message.time).toLocaleString('en-US')}</span> */}
        </>}
    </p>
  )
}

export default Message;