import { IoIosArrowBack } from 'react-icons/io';
import { BsThreeDotsVertical } from 'react-icons/bs';
import styles from './ChatHeader.module.css';

const ChatHeader = ({ contactInfo, chatId, onBack }) => (
  <div className={styles.chatHeader}>
    <button 
      onClick={onBack} 
      className={styles.backButton}
      aria-label="Volver atrás"
    >
      <IoIosArrowBack size={24} />
    </button>
    
    <div className={styles.contactInfo}>
      {contactInfo?.photoURL && (
        <img 
          src={contactInfo.photoURL} 
          alt={contactInfo.displayName} 
          className={styles.contactPhoto}
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png';
          }}
        />
      )}
      <div>
        <h3>{contactInfo?.displayName || chatId.replace('_', ' ↔ ')}</h3>
        {contactInfo?.status && (
          <span className={styles.status}>
            {contactInfo.status === 'online' ? 'En línea' : 'Últ. vez hoy a las 14:30'}
          </span>
        )}
      </div>
    </div>
    
    <button 
      className={styles.menuButton}
      aria-label="Menú de opciones"
    >
      <BsThreeDotsVertical size={20} />
    </button>
  </div>
);

export default ChatHeader;