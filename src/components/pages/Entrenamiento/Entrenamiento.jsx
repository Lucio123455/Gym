import React from 'react';
import EntrenamientoDelDia from './components/EntrenamientoDelDia/EntrenamientoDelDia';
import BotonModulo from './components/BotonModulo/BotonModulo';
import styles from './Entrenamiento.module.css';
import EntrenamientoSemanal from './components/EntrenamientoSemanal/EntrenamientoSemanal';

export default function Entrenamiento() {
  return (
    <div className={styles.entrenamiento}>
      <EntrenamientoDelDia />

      <div className={styles.gridBotones}>
        <BotonModulo
          icono="🏋️‍♂️"
          nombre="Rutinas"
          descripcion=""
          ruta="/rutinas"
        />
        <BotonModulo
          icono="📈"
          nombre="Progreso"
          descripcion=""
          ruta="/progreso"
        />
        <BotonModulo
          icono="💪"
          nombre="Ejercicios"
          descripcion=""
          ruta="/ejercicios"
        />
        <BotonModulo
          icono="🏆"
          nombre="Logros"
          descripcion=""
          ruta="/ejercicios"
        />
      </div>
      <EntrenamientoSemanal/>
    </div>
  );
}

