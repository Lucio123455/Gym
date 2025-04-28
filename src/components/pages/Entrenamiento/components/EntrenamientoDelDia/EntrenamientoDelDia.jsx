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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={`${styles.recordatorio} ${nombreDiaRutina === 'Descanso' ? styles.descanso : ''} ${styles.fadeIn}`}>
      <div className={styles.encabezado}>
        {/* ❌ Eliminamos emoji grande */}
        <h1 className={styles.dia}>{diaActual.charAt(0).toUpperCase() + diaActual.slice(1)}</h1>

        {/* ✅ Mantenemos botón de cambio 🔄 */}
        <button
          className={styles.changeDayIcon}
          onClick={() => setModoCambio(!modoCambio)}
          title="Cambiar Día"
        >
          🔄
        </button>
      </div>

      <div className={styles.contenido}>
        {nombreDiaRutina === 'Descanso' ? (
          <p className={styles.diaDescanso}>
            Día de descanso
          </p>
        ) : (
          <>
            <p className={styles.ejercicio}>
              {diaActual === nombreHoy ? '¡Hoy toca:' : 'Harás:'} {nombreDiaRutina}!
            </p>

            <button
              className={styles.startButton}
              onClick={() => navigate('/entrenamiento-dia')}
            >
              Comenzar Entrenamiento
            </button>
          </>
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







