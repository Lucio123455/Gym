import { BsCamera, BsEmojiSmile } from 'react-icons/bs';
import { IoIosSend } from 'react-icons/io';
import styles from './MessageInput.module.css';

const MessageInput = ({ 
  newMessage, 
  setNewMessage, 
  handleKeyPress, 
  sendMessage 
}) => (
  <div className={styles.container}>
    <button 
      className={styles.attachmentButton}
      aria-label="Adjuntar archivo"
    >
      <BsCamera size={24} />
    </button>
    
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
      <button 
        className={styles.emojiButton}
        aria-label="Seleccionar emoji"
      >
        <BsEmojiSmile size={20} />
      </button>
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