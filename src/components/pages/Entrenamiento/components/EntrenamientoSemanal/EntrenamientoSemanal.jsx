import React, { useEffect, useState } from 'react';
import styles from './EntrenamientoSemanal.module.css';
import Confetti from 'react-confetti';

export default function EntrenamientoSemanal() {
  const [diasCompletados, setDiasCompletados] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const totalDias = 5; // Meta semanal

  useEffect(() => {
    const diasAleatorios = Math.floor(Math.random() * (totalDias + 1)); // De 0 a 5
    setDiasCompletados(diasAleatorios);
  }, []);

  useEffect(() => {
    if (diasCompletados === totalDias) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000); // Dura 4 segundos
    }
  }, [diasCompletados, totalDias]);

  const porcentaje = Math.round((diasCompletados / totalDias) * 100);

  const getColor = () => {
    if (porcentaje < 40) return '#fbbf24'; // amarillo
    if (porcentaje < 80) return '#3b82f6'; // azul
    return '#22c55e'; // verde
  };

  return (
    <div className={`${styles.container} ${porcentaje === 100 ? styles.perfecto : ''}`}>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <h3 className={styles.titulo}>Progreso Semanal</h3>

      <div className={styles.subtitulo}>
        {diasCompletados} de {totalDias} días completados
      </div>

      <div className={styles.barraFondo}>
        <div 
          className={styles.barraProgreso}
          style={{
            width: `${porcentaje}%`,
            backgroundColor: getColor()
          }}
        />
      </div>

      <p className={styles.porcentaje}>{porcentaje}%</p>

      {porcentaje === 100 && (
        <div className={styles.trofeo}>
          🏆 ¡Semana Perfecta!
        </div>
      )}
    </div>
  );
}




