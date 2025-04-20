import { IoIosSend } from 'react-icons/io';
import styles from './MessageInput.module.css';

const MessageInput = ({ 
  newMessage, 
  setNewMessage, 
  handleKeyPress, 
  sendMessage 
}) => (
  <div className={styles.container}>
    
    
    <div className={styles.inputWrapper}>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Mensaje..."
        className={styles.input}
        aria-label="Escribe tu mensaje"
      />
      
    </div>
    
    <button 
      onClick={sendMessage} 
      className={styles.sendButton}
      disabled={!newMessage.trim()}
      aria-label="Enviar mensaje"
    >
      <IoIosSend size={24} />
    </button>
  </div>
);

export default MessageInput;