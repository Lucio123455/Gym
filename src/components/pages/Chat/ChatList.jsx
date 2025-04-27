import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onSnapshot, collection, getDocs, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase/config';
import styles from './ChatList.module.css';
import Contacto from './Contacto/Contacto';
import Loading from '../../../components/Loading/Loading'; // Ajustá el path según tu estructura

export default function ChatList() {
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const generateChatId = (dni1, dni2) => {
    return [dni1, dni2].sort().join('_');
  };

  const handleGoToChat = async (contactDni) => {
    if (!currentUser?.dni || !currentUser?.role) return;
  
    let participant0 = '';
    let participant1 = '';
  
    if (currentUser.role === 'member') {
      participant0 = currentUser.dni;
      participant1 = contactDni;
    } else if (currentUser.role === 'entrenador') {
      participant0 = contactDni;
      participant1 = currentUser.dni;
    } else {
      console.error("Rol no reconocido");
      return;
    }
  
    const chatId = generateChatId(participant0, participant1);
    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);
  
    if (!chatDoc.exists()) {
      // 🔎 Consultamos la cantidad de chats que tiene cada uno antes de crear
      const chatsSnapshot = await getDocs(collection(db, 'chats'));
  
      let chatsMember = 0;
      let chatsEntrenador = 0;
  
      chatsSnapshot.forEach((chat) => {
        const participants = chat.data().participants || [];
        if (participants.includes(participant0)) chatsMember++;
        if (participants.includes(participant1)) chatsEntrenador++;
      });
  
      // 🔥 Creamos el chat con la nueva propiedad posicionesEnLista
      await setDoc(chatRef, {
        participants: [participant0, participant1],
        readStatus: [true, true],
        posicionesEnLista: [chatsMember + 1, chatsEntrenador + 1],
        createdAt: new Date(),
      });
      console.log("🔄 Chat creado con posiciones:", [chatsMember + 1, chatsEntrenador + 1]);
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

      // 🔥 Filtrado dinámico según el rol del usuario actual
      const contactDocs = usersSnapshot.docs
        .filter(docSnap => docSnap.id !== user.uid) // no verse a sí mismo
        .filter(docSnap => {
          const contactRole = docSnap.data()?.role;
          if (userData.role === 'member') {
            return contactRole === 'entrenador'; // los users ven entrenadores
          } else if (userData.role === 'entrenador') {
            return contactRole === 'member'; // los entrenadores ven usuarios
          }
          return false; // otros roles no ven nada (opcional)
        });


      const initialContacts = contactDocs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
        tieneNoLeido: false,
      }));

      setContacts(initialContacts); // mostrar rápido

      // 🔁 Suscribirse en tiempo real a cada chat
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
            const posiciones = data.posicionesEnLista || [];
        
            const index = participants.indexOf(userData.dni);
        
            if (index !== -1) {
              updatedContacts[idx].tieneNoLeido = readStatus[index] === false;
              updatedContacts[idx].posicionEnLista = posiciones[index] ?? null;
            }
          } else {
            updatedContacts[idx].tieneNoLeido = false;
            updatedContacts[idx].posicionEnLista = null;
          }
        
          // 🛠️ Ahora ordenamos teniendo en cuenta tieneNoLeido y posicionEnLista
          const ordenados = updatedContacts.sort((a, b) => {
            if (a.tieneNoLeido !== b.tieneNoLeido) {
              return (b.tieneNoLeido ? 1 : 0) - (a.tieneNoLeido ? 1 : 0);
            }
        
            if (a.posicionEnLista != null && b.posicionEnLista != null) {
              return a.posicionEnLista - b.posicionEnLista;
            }
        
            if (a.posicionEnLista == null && b.posicionEnLista != null) return 1;
            if (a.posicionEnLista != null && b.posicionEnLista == null) return -1;
        
            return 0;
          });
        
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
      <Loading/>
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
              onChat={() => handleGoToChat(contact.dni, contact.role)}
            />
          ))
        ) : (
          <p className={styles.noContacts}>No hay contactos disponibles</p>
        )}
      </div>
    </div>
  );
}

