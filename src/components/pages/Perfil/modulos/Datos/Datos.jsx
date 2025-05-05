import React, { useEffect, useState } from 'react';
import { auth, db } from '../../../../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import styles from './Datos.module.css';

const defaultAvatars = [
  'https://images.pexels.com/photos/31914726/pexels-photo-31914726.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/28144564/pexels-photo-28144564/free-photo-of-naturaleza-verano-animal-hierba.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/19902540/pexels-photo-19902540/free-photo-of-gato-del-bosque-noruego.jpeg?auto=compress&cs=tinysrgb&w=600',
];

export default function Datos() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleAvatarChange = async (newUrl) => {
    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, 'users', user.uid), {
      fotoURL: newUrl
    });

    setUserData(prev => ({ ...prev, fotoURL: newUrl }));
  };

  if (loading || !userData) {
    return <div className={styles.loading}>Cargando perfil...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src={userData.fotoURL || defaultAvatars[0]} alt="Foto de perfil" className={styles.avatar} />
        <h2 className={styles.name}>{userData.nombre}</h2>
        <p className={styles.info}>{userData.email}</p>
        <p className={styles.info}>DNI: {userData.dni}</p>
        <p className={styles.info}>Rol: {userData.role}</p>

        <div className={styles.selectAvatar}>
          <h4>Cambiar foto:</h4>
          <div className={styles.avatarOptions}>
            {defaultAvatars.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Avatar ${idx + 1}`}
                onClick={() => handleAvatarChange(url)}
                className={`${styles.option} ${userData.fotoURL === url ? styles.active : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

