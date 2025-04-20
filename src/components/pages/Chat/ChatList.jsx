import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onSnapshot,collection, getDocs, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase/config';
import styles from './ChatList.module.css';
import Contacto from './Contacto/Contacto';

export default function ChatList() {
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const generateChatId = (dni1, dni2) => {
    return [dni1, dni2].sort().join('_');
  };

  const handleGoToChat = async (contactDni) => {
    if (!currentUser?.dni) return;

    const chatId = generateChatId(currentUser.dni, contactDni);
    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);

    if (!chatDoc.exists()) {
      await setDoc(chatRef, {
        participants: [currentUser.dni, contactDni],
        readStatus: [true, true], // inicializado
        createdAt: new Date(),
      });
    } else {
      const chatData = chatDoc.data();
      const participants = chatData.participants || [];
      const readStatus = chatData.readStatus || [false, false];
      const userIndex = participants.indexOf(currentUser.dni);

      if (userIndex !== -1) {
        const updatedReadStatus = [...readStatus];
        updatedReadStatus[userIndex] = true;

        await updateDoc(chatRef, {
          readStatus: updatedReadStatus,
        });

        console.log("Actualizado readStatus al entrar:", updatedReadStatus);
      }
    }

    navigate(`/chat/${chatId}`);
  };

  useEffect(() => {
    let unsubscribers = [];
  
    const fetchContactsRealtime = async () => {
      const user = auth.currentUser;
      if (!user) return;
  
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) return;
  
      const userData = userDoc.data();
      setCurrentUser(userData);
  
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const contactDocs = usersSnapshot.docs.filter(docSnap => docSnap.id !== user.uid);
  
      // Estado temporal para ir actualizando
      const initialContacts = contactDocs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
        tieneNoLeido: false,
      }));
  
      setContacts(initialContacts); // mostrar algo rápido
  
      // Para cada contacto, escuchar su chat
      contactDocs.forEach(docSnap => {
        const contactData = docSnap.data();
        const contactDni = contactData.dni;
        const chatId = generateChatId(userData.dni, contactDni);
        const chatRef = doc(db, 'chats', chatId);
  
        const unsubscribe = onSnapshot(chatRef, (docSnap) => {
          let updatedContacts = [...initialContacts];
  
          const idx = updatedContacts.findIndex(c => c.dni === contactDni);
          if (idx === -1) return;
  
          if (docSnap.exists()) {
            const data = docSnap.data();
            const participants = data.participants || [];
            const readStatus = data.readStatus || [false, false];
            const index = participants.indexOf(userData.dni);
  
            if (index !== -1) {
              updatedContacts[idx].tieneNoLeido = readStatus[index] === false;
            }
          } else {
            updatedContacts[idx].tieneNoLeido = false;
          }
  
          // Reordenar y setear
          const ordenados = updatedContacts.sort((a, b) =>
            (b.tieneNoLeido ? 1 : 0) - (a.tieneNoLeido ? 1 : 0)
          );
  
          setContacts(ordenados);
        });
  
        unsubscribers.push(unsubscribe);
      });
  
      setLoading(false);
    };
  
    fetchContactsRealtime();
  
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);
  


  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }


  return (
    <div className={styles.chatContainer}>
      <h2 className={styles.chatHeader}>Usuarios disponibles</h2>
      <div className={styles.contactsList}>
        {contacts.length > 0 ? (
          contacts.map(contact => (
            <Contacto
              key={contact.id}
              contact={{ ...contact, currentUserDni: currentUser.dni }}
              onChat={() => handleGoToChat(contact.dni)}
            />
          ))
        ) : (
          <p className={styles.noContacts}>No hay contactos disponibles</p>
        )}
      </div>
    </div>
  );
}

