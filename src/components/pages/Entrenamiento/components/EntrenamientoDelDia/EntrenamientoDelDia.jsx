import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import styles from './EntrenamientoDelDia.module.css';
import Loading from '../../../../Loading/Loading';

export default function EntrenamientoDelDia() {
  const navigate = useNavigate();
  const [rutinaNombre, setRutinaNombre] = useState('');
  const [nombreDiaRutina, setNombreDiaRutina] = useState('');
  const [loading, setLoading] = useState(true);
  const [diaActual, setDiaActual] = useState('');
  const [modoCambio, setModoCambio] = useState(false);
  const [diasDisponibles, setDiasDisponibles] = useState([]);

  const emojisEntrenamiento = ['🔥', '🏋️', '⚡', '💪', '🎯'];
  const emojiDescanso = '🛌';

  const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const hoy = new Date();
  const nombreHoy = diasSemana[hoy.getDay()];

  useEffect(() => {
    const fetchData = async (diaElegido) => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const rutinasRef = collection(db, 'users', user.uid, 'rutinas');
        const q = query(rutinasRef, where('principal', '==', true));
        const rutinasSnap = await getDocs(q);

        if (!rutinasSnap.empty) {
          const rutinaDoc = rutinasSnap.docs[0];
          const rutinaId = rutinaDoc.id;
          const rutinaData = rutinaDoc.data();

          setRutinaNombre(rutinaData.nombre || 'Sin nombre');

          const diasRef = collection(db, 'users', user.uid, 'rutinas', rutinaId, 'dias');
          const diasSnap = await getDocs(diasRef);

          const diasEncontrados = diasSnap.docs.map(docDia => docDia.id.toLowerCase());
          setDiasDisponibles(diasEncontrados);

          const diaBuscado = diaElegido || nombreHoy;
          const diaEncontrado = diasSnap.docs.find(docDia => docDia.id.toLowerCase() === diaBuscado.toLowerCase());

          if (diaEncontrado) {
            const diaData = diaEncontrado.data();
            setNombreDiaRutina(diaData.nombre || 'Sin nombre');
          } else {
            setNombreDiaRutina('Descanso');
          }

          setDiaActual(diaBuscado);
        } else {
          setRutinaNombre('No hay rutina principal');
          setNombreDiaRutina('Descanso');
        }
      } catch (error) {
        console.error('Error obteniendo rutina:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cambiarDia = (nuevoDia) => {
    setLoading(true);
    setModoCambio(false);

    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const rutinasRef = collection(db, 'users', user.uid, 'rutinas');
        const q = query(rutinasRef, where('principal', '==', true));
        const rutinasSnap = await getDocs(q);

        if (!rutinasSnap.empty) {
          const rutinaDoc = rutinasSnap.docs[0];
          const rutinaId = rutinaDoc.id;

          const diasRef = collection(db, 'users', user.uid, 'rutinas', rutinaId, 'dias');
          const diasSnap = await getDocs(diasRef);

          const diaEncontrado = diasSnap.docs.find(docDia => docDia.id.toLowerCase() === nuevoDia.toLowerCase());

          if (diaEncontrado) {
            const diaData = diaEncontrado.data();
            setNombreDiaRutina(diaData.nombre || 'Sin nombre');
          } else {
            setNombreDiaRutina('Descanso');
          }

          setDiaActual(nuevoDia);
        }
      } catch (error) {
        console.error('Error cambiando día:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  };

  const emojiMostrar = nombreDiaRutina === 'Descanso'
    ? emojiDescanso
    : emojisEntrenamiento[Math.floor(Math.random() * emojisEntrenamiento.length)];

  // Hasta acá todo igual...

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={`${styles.recordatorio} ${nombreDiaRutina === 'Descanso' ? styles.descanso : ''} ${styles.fadeIn}`}>

      <div className={styles.encabezado}>
        <span className={styles.icono}>{emojiMostrar}</span>
        <h1 className={styles.dia}>{diaActual.charAt(0).toUpperCase() + diaActual.slice(1)}</h1>

        {/* Botón cambio arriba a la derecha */}
        <button
          className={styles.changeDayIcon}
          onClick={() => setModoCambio(!modoCambio)}
          title="Cambiar Día"
        >
          🔄
        </button>
      </div>

      <div className={styles.contenido}>
        <p className={styles.ejercicio}>
          {nombreDiaRutina === 'Descanso'
            ? 'Hoy es tu día de descanso'
            : `${diaActual === nombreHoy ? '¡Hoy toca:' : 'Harás:'} ${nombreDiaRutina}!`}
        </p>

        {nombreDiaRutina !== 'Descanso' && (
          <button
            className={styles.startButton}
            onClick={() => navigate('/entrenamiento-dia')}
          >
            Comenzar Entrenamiento
          </button>
        )}
      </div>

      {modoCambio && (
        <div className={styles.diasLista}>
          {diasDisponibles.map(dia => (
            <button
              key={dia}
              className={styles.diaItem}
              onClick={() => cambiarDia(dia)}
            >
              {dia.charAt(0).toUpperCase() + dia.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}







