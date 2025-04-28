import React from 'react';
import { useAuth } from '../../../hooks/useAuth.js';
import { logout } from '../../../firebase/services/auth.js';
import BotonModulo from './components/BotonModulo/BotonModulo';
import styles from './Perfil.module.css';

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
      <h2 className={styles.titulo}>Hola, {user?.displayName || "Atleta"}!</h2>

      <div className={styles.botones}>
        <BotonModulo 
          icono="👤"
          nombre="Mis Datos"
          descripcion="Gestiona tu información personal"
          ruta="/perfil/datos"
        />
        <BotonModulo 
          icono="🎯"
          nombre="Mi Objetivo"
          descripcion="Revisa o cambia tu meta actual"
          ruta="/perfil/objetivo"
        />
        <BotonModulo 
          icono="💳"
          nombre="Pagos"
          descripcion="Consulta tus pagos y suscripciones"
          ruta="/perfil/pagos"
        />
        <BotonModulo 
          icono="📏"
          nombre="Medidas"
          descripcion="Controla tu progreso físico"
          ruta="/perfil/medidas"
        />
        <BotonModulo 
          icono="❓"
          nombre="Ayuda"
          descripcion="Resuelve tus dudas o contáctanos"
          ruta="/perfil/ayuda"
        />
        <BotonModulo 
          icono="🚪"
          nombre="Cerrar Sesión"
          descripcion="Salir de tu cuenta"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}


