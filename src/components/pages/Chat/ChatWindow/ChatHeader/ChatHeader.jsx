import React, { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../../firebase/config';
import styles from './ChatHeader.module.css';

const ChatHeader = ({ chatId, onBack }) => {
  const [nombreContacto, setNombreContacto] = useState();
  const [photoURL, setPhotoURL] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchContacto = async () => {
      const user = auth.currentUser;
      if (!user) return;
  
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const dniActual = userDoc.data()?.dni;
  
      const [dni1, dni2] = chatId.split('_');
      const dniContacto = dni1 === dniActual ? dni2 : dni1;
      
      const contactoDoc = await getDoc(doc(db, 'users', dniContacto));
      console.log(dniContacto)
      console.log("insano uno",contactoDoc)
      if (contactoDoc.exists()) {
        const data = contactoDoc.data();
        console.log("Datos del contacto:", data);
        setNombreContacto(data.nombre?.trim() || dniContacto);
        setPhotoURL(data.photoURL || '');
        setStatus(data.status || null);
      }
    };
  
    fetchContacto();
  }, [chatId]);
  

  return (
    <div className={styles.chatHeader}>
      <button 
        onClick={onBack} 
        className={styles.backButton}
        aria-label="Volver atrás"
      >
        <IoIosArrowBack size={24} />
      </button>
      
      <div className={styles.contactInfo}>
        {photoURL && (
          <img 
            src={photoURL} 
            alt={nombreContacto} 
            className={styles.contactPhoto}
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png';
            }}
          />
        )}
        <div>
          <h3>{nombreContacto}</h3>
          {status && (
            <span className={styles.status}>
              {status === 'online' ? 'En línea' : 'Últ. vez hoy a las 14:30'}
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
};

export default ChatHeader;
