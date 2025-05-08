import React from 'react';
import styles from './Encabezado.module.css';

export default function Encabezado({ usuario, eliminarPublicacion, fecha }) {
  return (
    <div className={styles.encabezado}>
      <div className={styles.autorInfo}>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzPs0ng1OihF-_SsKH3o2j2ThKJa21zWYlmg&s"
          alt="Avatar del autor"
          className={styles.avatar}
        />
        <span className={styles.nombreAutor}>Will Power Gym</span>
      </div>
      <span className={styles.fecha}>
        {new Date(fecha).toLocaleDateString()}
      </span>
      {usuario?.role === 'admin' && (
        <button className={styles.botonEliminar} onClick={eliminarPublicacion}>
          Eliminar
        </button>
      )}
    </div>
  );
}
