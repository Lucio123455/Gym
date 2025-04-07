import React from 'react';
import { useAuth } from '../../../hooks/useAuth.js';
import { logout } from '../../../firebase/services/auth.js';
import styles from './Perfil.module.css'; // Opcional: para estilos

export default function Perfil() {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h2>Mi Perfil</h2>
      
      {user && (
        <div className={styles.userInfo}>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.role}</p>
        </div>
      )}

      <button 
        onClick={handleLogout}
        className={styles.logoutButton}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}