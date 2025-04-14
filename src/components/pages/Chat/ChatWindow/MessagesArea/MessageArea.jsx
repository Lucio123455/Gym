import { useRef } from 'react';
import MessageBubble from '../MessageBubble/MessageBubble';
import styles from './MessagesArea.module.css';

const MessagesArea = ({ messages, currentUserDni, formatTime }) => {
  const messagesEndRef = useRef(null);
  
  return (
    <div className={styles.messagesArea}>
      {messages.map(msg => (
        <MessageBubble
          key={msg.id}
          msg={msg}
          currentUserDni={currentUserDni}
          formatTime={formatTime}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesArea;