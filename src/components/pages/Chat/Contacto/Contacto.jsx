import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../../../firebase/config';
import styles from './Contacto.module.css';

export default function Contacto({ contact, onChat }) {
  const [lastMessage, setLastMessage] = useState('');
  const [unread, setUnread] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) return;

      const currentUserDni = contact.currentUserDni;
      const chatId = [currentUserDni, contact.dni].sort().join('_');
      const chatRef = doc(db, 'chats', chatId);

      const unsub = onSnapshot(chatRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setLastMessage(data.lastMessage || '');

          const { participants, readStatus } = data;
          const index = -1 * participants.indexOf(currentUserDni);
        console.log('Index:', index);
          if (index !== -1) {
            const hasUnread = readStatus?.[index] === false;
            setUnread(hasUnread);
          }
        }
      });

      return unsub;
    });

    return () => unsubscribe();
  }, [contact]);

  return (
    <div 
      className={`${styles.contactCard} ${unread ? styles.unread : ''}`} 
      onClick={onChat}
    >
      <div className={styles.contactAvatar}>
        {contact.nombre?.charAt(0).toUpperCase() || contact.email?.charAt(0).toUpperCase()}
      </div>
      <div className={styles.contactInfo}>
        <h3>{contact.nombre || 'Usuario sin nombre'}</h3>
        <p className={styles.lastMessage}>
          {lastMessage ? lastMessage : 'Sin mensajes aún'}
        </p>
      </div>
      {unread && <div className={styles.unreadDot}></div>}
    </div>
  );
}

