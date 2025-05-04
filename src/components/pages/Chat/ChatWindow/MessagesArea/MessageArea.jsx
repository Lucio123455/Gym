import { useRef, useEffect } from 'react';
import MessageBubble from '../MessageBubble/MessageBubble';
import styles from './MessagesArea.module.css';

const MessagesArea = ({ messages, currentUserDni, formatTime }) => {
  const messagesEndRef = useRef(null);

  // 🔁 Scroll automático al final cuando cambian los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
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
