import React, { useState } from 'react';
import Publicacion from '../Publicacion/Publicacion';
import styles from './Publicaciones.module.css';

function Publicaciones({ publicaciones, usuario }) {
  const [mutedGlobal, setMutedGlobal] = useState(true); // 🔊 estado compartido


  return (
    <div className={styles.publicacionesContainer}>
      {publicaciones.map((publicacion) => (
        <Publicacion
          key={publicacion.id}
          publicacion={publicacion}
          usuario={usuario}
          mutedGlobal={mutedGlobal}
          setMutedGlobal={setMutedGlobal} />
      ))}
    </div>
  );
}

export default Publicaciones;
