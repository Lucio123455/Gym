import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, data } from 'react-router-dom';
import {
  collection, query, orderBy, onSnapshot,
  doc, getDoc, addDoc, serverTimestamp, updateDoc, setDoc, getDocs
} from 'firebase/firestore';
import { db, auth } from '../../../../firebase/config';
import styles from './ChatWindow.module.css';
import MessageInput from './MessageInput/MessageInput';
import MessagesArea from './MessagesArea/MessageArea';
import ChatHeader from './ChatHeader/ChatHeader';
import Loading from '../../../Loading/Loading';

export default function ChatWindow() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserDni, setCurrentUserDni] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [contactInfo, setContactInfo] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState('');

  useEffect(() => {
    const fetchUserAndContact = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const dni = userDoc.data()?.dni || '';
      const role = userDoc.data()?.role || '';

      setCurrentUserDni(dni);
      setCurrentUserRole(role); // 👈 nuevo


      const contactDni = chatId.split('_').find(d => d !== dni);
      const contactDoc = await getDoc(doc(db, 'users', contactDni));
      setContactInfo(contactDoc.data());
    };

    fetchUserAndContact();
  }, [chatId]);

  useEffect(() => {
    if (!currentUserDni) return;

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));
      setMessages(msgs);
      setLoading(false);

      // 🔄 Marcar como leído
      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);

      if (chatSnap.exists()) {
        const { participants, readStatus = [false, false] } = chatSnap.data();
        const index = participants.indexOf(currentUserDni);

        if (index !== -1 && readStatus[index] === false) {
          const updated = [...readStatus];
          updated[index] = true;

          await updateDoc(chatRef, { readStatus: updated });
          console.log("🔄 Marcado como leído en tiempo real:", updated);
        }
      }
    });

    return () => unsubscribe();
  }, [chatId, currentUserDni]);


  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUserDni) {
      console.log("Mensaje vacío o dni del usuario no definido.");
      return;
    }
  
    try {
      console.log("Obteniendo referencia al chat:", chatId);
      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);
  
      if (!chatSnap.exists()) {
        console.error("El chat no existe aún.");
        return;
      }
  
      const chatData = chatSnap.data();
      console.log("Datos del chat:", chatData);
  
      const participants = chatData.participants;
      console.log("Participantes del chat:", participants);
  
      const senderIndex = participants.indexOf(currentUserDni);
      console.log("Índice del usuario actual:", senderIndex);
  
      if (senderIndex === -1) {
        console.error("El usuario actual no está en la conversación.");
        return;
      }
  
      const readStatus = [true, true];
      readStatus[1 - senderIndex] = false;
      console.log("Nuevo estado de lectura:", readStatus);
  
      // ✅ PRIMERO mandar el mensaje rápido
      console.log("Agregando mensaje...");
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        senderDni: currentUserDni,
        text: newMessage,
        timestamp: serverTimestamp(),
        read: false
      });
      console.log("Mensaje agregado.");
  
      console.log("Actualizando documento del chat (lastMessage, lastUpdated)...");
      await updateDoc(chatRef, {
        lastMessage: newMessage,
        lastUpdated: serverTimestamp(),
        readStatus: readStatus
      });
      console.log("Chat actualizado.");
  
      setNewMessage(''); // ✅ limpiarlo rápido para la UX
      console.log("Mensaje limpiado en el input.");
  
      // 🔥 DESPUÉS actualizar posiciones en lista
      console.log("Recalculando posiciones en lista...");
  
      const allChatsSnapshot = await getDocs(collection(db, 'chats'));
      const updates = [];
  
      allChatsSnapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (!data.participants) return;
  
        data.participants.forEach((dni, idx) => {
          if (dni === currentUserDni || dni === participants[1 - senderIndex]) {
            const ref = doc(db, 'chats', docSnap.id);
            const nuevasPosiciones = data.posicionesEnLista ? [...data.posicionesEnLista] : [0, 0];
            nuevasPosiciones[idx] = (nuevasPosiciones[idx] || 0) + 1;
            updates.push(updateDoc(ref, { posicionesEnLista: nuevasPosiciones }));
          }
        });
      });
  
      await Promise.all(updates);
  
      console.log("Posiciones anteriores actualizadas.");
  
      // Ahora asignar [1, 1] al chat actual
      await updateDoc(chatRef, {
        posicionesEnLista: [1, 1]
      });
  
      console.log("Asignadas posiciones [1,1] a este chat.");
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };
  
  


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <Loading/>
    );
  }

  return (

    <div className={styles.chatContainer}>
      <ChatHeader
        contactInfo={contactInfo}
        chatId={chatId}
        onBack={() => navigate(-1)}
      />

      <MessagesArea
        messages={messages}
        currentUserDni={currentUserDni}
        formatTime={formatTime}
      />

      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleKeyPress={handleKeyPress}
        sendMessage={sendMessage}
        currentUserRole={currentUserRole} // 👈 ahora sí es el del usuario actual
        chatId={chatId}

        />
    </div>
  );
}