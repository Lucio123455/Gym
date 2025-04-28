import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BotonModulo.module.css';

export default function BotonModulo({ icono, nombre, descripcion, ruta, onClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(); // Si mandan una función específica, la ejecuta
    } else if (ruta) {
      navigate(ruta); // Si no, navega a la ruta
    }
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.icono}>{icono}</div>
      <div className={styles.texto}>
        <h3 className={styles.nombre}>{nombre}</h3>
        {descripcion && <p className={styles.descripcion}>{descripcion}</p>}
      </div>
    </div>
  );
}
