import React from 'react';
import EntrenamientoDelDia from './components/EntrenamientoDelDia/EntrenamientoDelDia';
import BotonModulo from './components/BotonRutinas/BotonModulo';
import styles from './Entrenamiento.module.css'

export default function Entrenamiento() {
  return (
    <div className= {styles.entrenamiento}>
      <EntrenamientoDelDia />
      <BotonModulo 
        nombre="Rutinas"
        descripcion="Aquí podrás encontrar las rutinas de los otros usuarios y las tuyas."
        ruta="/rutinas"
      />
      <BotonModulo 
        nombre="Progreso"
        descripcion="Aquí podrás encontrar tu progreso en los ejercicios."
        ruta="/rutinas"
      />
      <BotonModulo 
        nombre="Ejercicios"
        descripcion="Entra aqui si quieres conocer las tecnicas"
        ruta="/rutinas"
      />
    </div>
  );
}
