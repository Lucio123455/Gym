import React from 'react';
import styles from './Descripcion.module.css';

export default function Descripcion({ texto }) {
  return (
    <div className={styles.descripcion}>
      <span>{texto}</span>
    </div>
  );
}
