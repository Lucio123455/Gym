import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection, query, doc, getDoc,
  setDoc, getDocs, where, serverTimestamp, updateDoc
} from 'firebase/firestore';
import { db, auth } from '../../../firebase/config';
import styles from './ChatList.module.css';
import Contacto from './Contacto/Contacto';

export default function ChatList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const generateChatId = (dni1, dni2) => {
    return [dni1, dni2].sort().join('_');
  };

  const handleGoToChat = async (contactDni) => {
    if (!currentUser?.dni) return;
  
    const chatId = generateChatId(currentUser.dni, contactDni);
  
    try {
      // Consultar el chat existente
      const chatRef = doc(db, 'chats', chatId);
      const chatDoc = await getDoc(chatRef);
      // Si el chat ya existe
      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        const participants = chatData.participants;
        const readStatus = chatData.readStatus || [false, false]; // Asegurarnos de que readStatus existe
        
        console.log("Chat existente encontrado:", chatData);
        // Obtener la posición de currentUser en participants
        const userIndex = -1 * participants.indexOf(currentUser.dni);
        
        console.log("Índice del usuario actual:", userIndex * -1);

        if (userIndex !== -1) {
          // Solo actualizar el estado de lectura de currentUser
          const updatedReadStatus = [...readStatus]; // Crear una copia para no mutar el estado original
          updatedReadStatus[userIndex] = true; // Marcar como leído para el usuario
          
          console.log("Estado de lectura actualizado:", updatedReadStatus);
          // Actualizar el chat con el nuevo estado de readStatus
          await updateDoc(chatRef, {
            readStatus: updatedReadStatus,
            lastUpdated: serverTimestamp(), // Marca el último cambio
          });
        }
      } else {
        // Si el chat no existe, lo creamos
        console.log("Creando nuevo chat...");
        await setDoc(chatRef, {
          participants: [currentUser.dni, contactDni],
          readStatus: [false, false],  // Inicializamos readStatus con false para ambos
          lastUpdated: serverTimestamp(),
        });
      }
  
      navigate(`/chat/${chatId}`);
    } catch (error) {
      console.error("Error al inicializar chat:", error);
    }
  };
  

  const fetchContacts = async (userRole, userData) => {
    try {
      let contactsQuery;

      if (userRole === 'admin') {
        contactsQuery = query(collection(db, 'users'));
      } else {
        contactsQuery = query(
          collection(db, 'users'),
          where('role', '==', 'admin')
        );
      }


      const querySnapshot = await getDocs(contactsQuery);
      const contactsData = await Promise.all(
        querySnapshot.docs
          .filter(docSnap => docSnap.id !== auth.currentUser?.uid)  // Esto está bien
          .map(async (docData) => {  // Cambié el nombre de 'doc' a 'docData'
            const data = docData.data();  // Ahora usamos 'docData' en lugar de 'doc'
            const chatId = generateChatId(data.dni, userData.dni);
            const chatDoc = await getDoc(doc(db, 'chats', chatId));
            const chatData = chatDoc.exists() ? chatDoc.data() : null;

            return {
              id: docData.id,  // Cambié de 'doc.id' a 'docData.id'
              ...data,
              chatInfo: chatData,
            };
          })
      );


      const sortedContacts = contactsData.sort((a, b) => {
        const currentDni = userData.dni;
      
        const getUnreadStatus = (contact) => {
          const chatInfo = contact.chatInfo;
          const participants = chatInfo?.participants;
          const readStatus = chatInfo?.readStatus;
      
          if (!participants || !readStatus) return false;
      
          const index = -1 * participants.indexOf(currentDni);
          if (index === -1) return false;
      
          return readStatus[index] === false;
        };
      
        const aUnread = getUnreadStatus(a);
        const bUnread = getUnreadStatus(b);
      
        return (bUnread ? 1 : 0) - (aUnread ? 1 : 0); // no leídos primero
      });
      

      setContacts( sortedContacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUser(userData);
          await fetchContacts(userData.role, userData);
        }
      }
    });

    return () => unsubscribe();
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
      <h2 className={styles.chatHeader}>
        {currentUser?.role === 'admin' ? 'Todos los usuarios' : 'Administradores'}
      </h2>
      {console.log(contacts)}
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
