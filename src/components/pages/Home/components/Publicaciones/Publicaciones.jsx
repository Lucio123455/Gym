import React from 'react';
import Publicacion from '../Publicacion/Publicacion';
import styles from './Publicaciones.module.css';

function Publicaciones({publicaciones, usuario}) {
  return (
    <div className={styles.publicacionesContainer}>
      {publicaciones.map((publicacion) => (
        <Publicacion key={publicacion.id} publicacion={publicacion} usuario={usuario} />
      ))}
    </div>
  );
}

export default Publicaciones;
