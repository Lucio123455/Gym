// src/components/Loading/Loading.jsx
// src/components/Loading/Loading.jsx
import React from 'react';
import styles from './Loading.module.css';

export default function Loading() {
  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzPs0ng1OihF-_SsKH3o2j2ThKJa21zWYlmg&s" alt="Will Power logo" className={styles.logo} />
        <p className={styles.text}>Will Power</p>
        <div className={styles.spinner}></div>
      </div>
    </div>
  );
}

