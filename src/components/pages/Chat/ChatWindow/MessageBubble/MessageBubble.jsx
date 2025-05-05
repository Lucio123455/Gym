import styles from './MessageBubble.module.css';

const MessageBubble = ({ msg, currentUserDni, formatTime }) => {
  const isSent = msg.senderDni === currentUserDni;
  const isRead = msg.read;
  const isAsignacion = msg.tipo === 'asignacion';

  return (
    <div className={`${styles.messageBubble} ${isAsignacion ? styles.centrada : isSent ? styles.sent : styles.received}`}>
      <div className={`${styles.messageContent} ${isAsignacion ? styles.asignacion : ''} ${isSent ? (isRead ? styles.sentRead : styles.sentUnread) : ''}`}>
        {isAsignacion ? (
          <>
            <p>🏋️ {msg.text}</p>
            <a
              href={msg.link || '/entrenamiento/rutinas'}
              className={styles.linkEspecial}
              target="_blank"
              rel="noopener noreferrer"
            >
              👉 Ver rutina asignada
            </a>
          </>
        ) : (
          <p>{msg.text}</p>
        )}
        <span className={styles.messageTime}>
          {formatTime(msg.timestamp)}
          {isSent && <span className={styles.readStatus}>✓✓</span>}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;



