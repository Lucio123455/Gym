import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  collection, query, orderBy, onSnapshot, 
  doc, getDoc, addDoc, serverTimestamp, updateDoc, setDoc
} from 'firebase/firestore';
import { db, auth } from '../../../firebase/config';
import { IoIosArrowBack, IoIosSend } from 'react-icons/io';
import { BsThreeDotsVertical, BsEmojiSmile, BsCamera } from 'react-icons/bs';
import styles from './ChatWindow.module.css';

export default function ChatWindow() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserDni, setCurrentUserDni] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [contactInfo, setContactInfo] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const getUserDni = async () => {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setCurrentUserDni(userDoc.data()?.dni || '');
        
        // Obtener info del contacto
        const contactDni = chatId.split('_').find(dni => dni !== userDoc.data()?.dni);
        const contactDoc = await getDoc(doc(db, 'users', contactDni));
        setContactInfo(contactDoc.data());
      };
      getUserDni();
    }

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() // Convertir a Date object
      }));
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUserDni) return;

    try {
      // Crear chat si no existe (con merge)
      await setDoc(doc(db, 'chats', chatId), {
        participants: chatId.split('_'),
        lastUpdated: serverTimestamp()
      }, { merge: true });

      // Añadir mensaje
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        senderDni: currentUserDni,
        text: newMessage,
        timestamp: serverTimestamp(),
        read: false
      });

      // Actualizar último mensaje
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: newMessage,
        lastUpdated: serverTimestamp()
      });

      setNewMessage('');
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
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.chatContainer}>
      {/* Header estilo Instagram */}
      <div className={styles.chatHeader}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <IoIosArrowBack size={24} />
        </button>
        <div className={styles.contactInfo}>
          {contactInfo?.photoURL && (
            <img src={contactInfo.photoURL} alt={contactInfo.displayName} className={styles.contactPhoto} />
          )}
          <h3>{contactInfo?.displayName || chatId.replace('_', ' ↔ ')}</h3>
          <span className={styles.status}>En línea</span>
        </div>
        <button className={styles.menuButton}>
          <BsThreeDotsVertical size={20} />
        </button>
      </div>

      {/* Área de mensajes */}
      <div className={styles.messagesArea}>
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`${styles.messageBubble} ${
              msg.senderDni === currentUserDni ? styles.sent : styles.received
            }`}
          >
            <div className={styles.messageContent}>
              <p>{msg.text}</p>
              <span className={styles.messageTime}>
                {formatTime(msg.timestamp)}
                {msg.senderDni === currentUserDni && (
                  <span className={styles.readStatus}>✓✓</span>
                )}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de mensaje */}
      <div className={styles.messageInputContainer}>
        <button className={styles.attachmentButton}>
          <BsCamera size={24} />
        </button>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mensaje..."
            className={styles.messageInput}
          />
          <button className={styles.emojiButton}>
            <BsEmojiSmile size={20} />
          </button>
        </div>
        <button 
          onClick={sendMessage} 
          className={styles.sendButton}
          disabled={!newMessage.trim()}
        >
          <IoIosSend size={24} />
        </button>
      </div>
    </div>
  );
}