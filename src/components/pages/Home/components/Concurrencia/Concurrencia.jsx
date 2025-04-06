import styles from './Concurrencia.module.css';
import { useState, useEffect } from 'react';

function Concurrencia() {
  const [estado, setEstado] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    // Simulamos la llamada a la base de datos con un estado aleatorio
    const estados = [
      { tipo: 'vacio', color: 'verde', mensaje: 'Muy tranquilo' },
      { tipo: 'normal', color: 'amarillo', mensaje: 'Afluencia normal' },
      { tipo: 'ocupado', color: 'naranja', mensaje: 'Más lleno de lo habitual' },
      { tipo: 'lleno', color: 'rojo', mensaje: '¡Aforo completo!' }
    ];
    
    const randomEstado = estados[Math.floor(Math.random() * estados.length)];
    setEstado(randomEstado.tipo);
    setMensaje(randomEstado.mensaje);
    
    // Simular actualización periódica (cada 5 segundos)
    const intervalo = setInterval(() => {
      const newEstado = estados[Math.floor(Math.random() * estados.length)];
      setEstado(newEstado.tipo);
      setMensaje(newEstado.mensaje);
    }, 50000);
    
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className={`${styles.cartel} ${styles[estado]}`}>
      <div className={styles.contenido}>
        <h3 className={styles.titulo}>Estado actual</h3>
        <p className={styles.mensaje}>{mensaje}</p>
        <div className={styles.indicador}></div>
      </div>
    </div>
  );
}

export default Concurrencia;