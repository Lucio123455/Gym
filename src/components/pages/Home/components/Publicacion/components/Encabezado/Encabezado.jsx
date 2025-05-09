import React from 'react';
import styles from './Encabezado.module.css';

export default function Encabezado({ usuario, eliminarPublicacion, fecha }) {
  return (
    <div className={styles.encabezado}>
      <div className={styles.autorInfo}>
        <img
          src={usuario.fotoURL}
          alt={`Avatar de ${usuario.nombre}`}
          className={styles.avatar}
          title={usuario.nombre} // tooltip opcional
        />
        <span className={styles.nombreAutor}>{usuario.nombre}</span>
      </div>

      <div className={styles.fechaYBoton}>
        <span className={styles.fecha}>
          {new Date(fecha).toLocaleDateString()}
        </span>

        {usuario?.role === 'admin' && (
          <button className={styles.botonEliminar} onClick={eliminarPublicacion}>
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}



