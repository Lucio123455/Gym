import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase/config'; // Asegúrate de tener tu configuración de Firebase
import styles from './Chat.module.css';

export default function Chat() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Verificar usuario autenticado
        auth.onAuthStateChanged(async (user) => {
          if (user) {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            setCurrentUser(userDoc.data());
            fetchContacts(userDoc.data().role);
          }
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchContacts = async (userRole) => {
      try {
        let contactsQuery;
        
        if (userRole === 'admin') {
          // Admins ven todos los usuarios
          contactsQuery = query(collection(db, 'users'));
        } else {
          // Members ven solo admins
          contactsQuery = query(
            collection(db, 'users'),
            where('role', '==', 'admin')
          );
        }

        const querySnapshot = await getDocs(contactsQuery);
        const contactsData = querySnapshot.docs
          .filter(doc => doc.id !== auth.currentUser?.uid) // Excluir al usuario actual
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

        setContacts(contactsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contacts:", error);
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
                <p>{contact.email}</p>
                <span className={`${styles.roleBadge} ${contact.role === 'admin' ? styles.adminBadge : styles.memberBadge}`}>
                  {contact.role === 'admin' ? 'Administrador' : 'Miembro'}
                </span>
              </div>
              <button className={styles.chatButton}>
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