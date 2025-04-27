import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BotonModulo.module.css';

export default function BotonModulo({ nombre, descripcion, ruta }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(ruta);
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <h2 className={styles.title}>{nombre}</h2>
      <p className={styles.description}>{descripcion}</p>
    </div>
  );
}

