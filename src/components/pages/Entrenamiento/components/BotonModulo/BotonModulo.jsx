import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BotonModulo.module.css';

export default function BotonModulo({ nombre, descripcion, ruta, icono }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(ruta);
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.icono}>
        {icono}
      </div>
      <div className={styles.texto}>
        <h3 className={styles.nombre}>{nombre}</h3>
        <p className={styles.descripcion}>{descripcion}</p>
      </div>
    </div>
  );
}


