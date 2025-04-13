import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  collection, query, orderBy, onSnapshot, 
  doc, getDoc, addDoc, serverTimestamp, updateDoc, setDoc , getDocs, where
} from 'firebase/firestore';
import { db, auth } from '../../../firebase/config';
import styles from './ChatList.module.css';

export default function ChatList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Función para generar un ID de chat único
  const generateChatId = (dni1, dni2) => {
    return [dni1, dni2].sort().join('_');
  };
  
  const handleGoToChat = async (contactDni) => {
    if (!currentUser?.dni) return;
    
    const chatId = generateChatId(currentUser.dni, contactDni);
    
    try {
      // Esto crea el documento si no existe, o lo actualiza si existe
      await setDoc(doc(db, 'chats', chatId), {
        participants: [currentUser.dni, contactDni],
        lastUpdated: serverTimestamp()
      }, { merge: true }); // ← Esto es clave
      
      navigate(`/chat/${chatId}`);
    } catch (error) {
      console.error("Error al inicializar chat:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        auth.onAuthStateChanged(async (user) => {
          if (user) {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              setCurrentUser(userDoc.data());
              fetchContacts(userDoc.data().role);
            }
          }
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    const fetchContacts = async (userRole) => {
      try {
        let contactsQuery;
        
        if (userRole === 'admin') {
          // Admins ven todos los usuarios excepto ellos mismos
          contactsQuery = query(collection(db, 'users'));
        } else {
          // Miembros ven solo admins
          contactsQuery = query(
            collection(db, 'users'),
            where('role', '==', 'admin')
          );
        }

        const querySnapshot = await getDocs(contactsQuery);
        const contactsData = querySnapshot.docs
          .filter(doc => doc.id !== auth.currentUser?.uid)
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

        setContacts(contactsData);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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
      
      <div className={styles.contactsList}>
        {contacts.length > 0 ? (
          contacts.map(contact => (
            <div key={contact.id} className={styles.contactCard}>
              <div className={styles.contactAvatar}>
                {contact.nombre?.charAt(0) || contact.email?.charAt(0)}
              </div>
              <div className={styles.contactInfo}>
                <h3>{contact.nombre || 'Usuario sin nombre'}</h3>
                <p>DNI: {contact.dni}</p>
                <span className={`${styles.roleBadge} ${contact.role === 'admin' ? styles.adminBadge : styles.memberBadge}`}>
                  {contact.role === 'admin' ? 'Administrador' : 'Miembro'}
                </span>
              </div>
              <button 
                className={styles.chatButton}
                onClick={() => handleGoToChat(contact.dni)}
              >
                Ir al chat
              </button>
            </div>
          ))
        ) : (
          <p className={styles.noContacts}>No hay contactos disponibles</p>
        )}
      </div>
    </div>
  );
}