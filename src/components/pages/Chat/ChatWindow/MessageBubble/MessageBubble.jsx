import styles from './MessageBubble.module.css';

const MessageBubble = ({ msg, currentUserDni, formatTime }) => (
  <div 
    className={`${styles.messageBubble} ${
      msg.senderDni === currentUserDni ? styles.sent : styles.received
    }`}
  >
    <div className={styles.messageContent}>
      <p>{msg.text}</p>
      <span className={styles.messageTime}>
        {formatTime(msg.timestamp)}
        {msg.senderDni === currentUserDni && (
          <span className={styles.readStatus}>✓✓</span>
        )}
      </span>
    </div>
  </div>
);

export default MessageBubble;