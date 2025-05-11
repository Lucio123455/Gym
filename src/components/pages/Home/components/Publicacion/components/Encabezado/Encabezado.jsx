import React from 'react';
import styles from './Encabezado.module.css';

export default function Encabezado({ usuario,publicacion, eliminarPublicacion, fecha }) {
  return (
    <div className={styles.encabezado}>
      <div className={styles.autorInfo}>
        <img
          src={publicacion.fotoURL}
          alt={`Avatar de ${publicacion.autor}`}
          className={styles.avatar}
          title={publicacion.autor} // tooltip opcional
        />
        <span className={styles.nombreAutor}>{publicacion.autor}</span>
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



