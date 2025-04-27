import styles from './MessageBubble.module.css';

const MessageBubble = ({ msg, currentUserDni, formatTime }) => {
  const isSent = msg.senderDni === currentUserDni;
  const isRead = msg.read;

  return (
    <div className={`${styles.messageBubble} ${isSent ? styles.sent : styles.received}`}>
      <div className={`${styles.messageContent} ${isSent ? (isRead ? styles.sentRead : styles.sentUnread) : ''}`}>
        <p>{msg.text}</p>
        <span className={styles.messageTime}>
          {formatTime(msg.timestamp)}
          {isSent && <span className={styles.readStatus}>✓✓</span>}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;

