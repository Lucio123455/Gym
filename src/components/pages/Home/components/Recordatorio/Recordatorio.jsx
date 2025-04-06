import styles from './Recordatorio.module.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Recordatorio() {
  const [rutina, setRutina] = useState('');
  const [dia, setDia] = useState('');

  useEffect(() => {
    // Simulación de datos de rutina por día
    const rutinasSemana = {
      lunes: { ejercicio: 'Pecho y Tríceps', icono: '💪' },
      martes: { ejercicio: 'Piernas', icono: '🦵' },
      miércoles: { ejercicio: 'Espalda y Bíceps', icono: '🏋️' },
      jueves: { ejercicio: 'Cardio Intenso', icono: '🏃' },
      viernes: { ejercicio: 'Hombros y Abdomen', icono: '🤸' },
      sábado: { ejercicio: 'Funcional', icono: '⚡' },
      domingo: { ejercicio: 'Descanso', icono: '🛌' }
    };

    const actualizarRutina = () => {
      const dias = Object.keys(rutinasSemana);
      const diaAleatorio = dias[Math.floor(Math.random() * dias.length)];
      
      setDia(diaAleatorio);
      setRutina(rutinasSemana[diaAleatorio]);
    };

    actualizarRutina();
    const intervalo = setInterval(actualizarRutina, 100000); // Cambio cada 8 segundos

    return () => clearInterval(intervalo);
  }, []);

  return (
    <Link 
      to="/entrenamiento" 
      className={`${styles.enlace} ${rutina.ejercicio === 'Descanso' ? styles.descanso : ''}`}
    >
      <div className={styles.recordatorio}>
        <div className={styles.encabezado}>
          <span className={styles.icono}>{rutina.icono}</span>
          <h3 className={styles.dia}>{dia.charAt(0).toUpperCase() + dia.slice(1)}</h3>
        </div>
        
        <div className={styles.contenido}>
          <p className={styles.ejercicio}>
            {rutina.ejercicio === 'Descanso' 
              ? '¡Día de descanso!'
              : `Rutina: ${rutina.ejercicio}`}
          </p>
          {rutina.ejercicio !== 'Descanso' && (
            <p className={styles.motivacion}>"Haz clic para ver los ejercicios"</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default Recordatorio;