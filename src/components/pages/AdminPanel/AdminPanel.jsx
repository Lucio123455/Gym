import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { logout } from '../../../firebase/services/auth';
import CrearPublicacion from './components/CrearPublicacion/CrearPublicacion'; // Asegúrate que la ruta es correcta
import styles from './AdminPanel.module.css';

export default function AdminPanel() {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.adminTitle}>Panel de Administración</h1>
      
      {user && (
        <>
          <div className={styles.adminUserInfo}>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rol:</strong> <span className={styles.adminRole}>{user.role}</span></p>
          </div>
          
          <div className={styles.adminFeatures}>
            <h3>Funciones administrativas:</h3>
            
            <button 
              className={styles.featureButton}
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? 'Ocultar formulario' : 'Crear publicaciones'}
            </button>
            
          </div>

          {/* Mostrar el formulario solo cuando showCreateForm es true */}
          {showCreateForm && (
            <div className={styles.formContainer}>
              <CrearPublicacion />
            </div>
          )}
        </>
      )}

      <button 
        onClick={handleLogout}
        className={styles.adminLogoutButton}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}