import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../firebase/config';
import styles from './Contacto.module.css';

export default function Contacto({ contact, onChat }) {
  const [lastMessage, setLastMessage] = useState('');
  const [hasUnread, setHasUnread] = useState(false); // Nuevo estado

  useEffect(() => {
    const chatId = [contact.currentUserDni, contact.dni].sort().join('_');
    const chatRef = doc(db, 'chats', chatId);

    const unsubscribe = onSnapshot(chatRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();

        setLastMessage(data.lastMessage || '');

        const participants = data.participants || [];
        const readStatus = data.readStatus || [false, false];

        const index = participants.indexOf(contact.currentUserDni);
        if (index !== -1) {
          setHasUnread(readStatus[index] === false);
        }
      }
    });

    return () => unsubscribe();
  }, [contact]);

  return (
    <div
      className={`${styles.contactCard} ${hasUnread ? styles.unread : ''}`}
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

      {hasUnread && <div className={styles.unreadDot}></div>}
    </div>
  );
}



