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
  const [sinRutinaPrincipal, setSinRutinaPrincipal] = useState(false);

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
  
          console.log('✅ Rutina principal encontrada:', rutinaData);
          setRutinaNombre(rutinaData.nombre || 'Sin nombre');
  
          const diasRef = collection(db, 'users', user.uid, 'rutinas', rutinaId, 'Dias');
          const diasSnap = await getDocs(diasRef);
  
          const diasEncontrados = diasSnap.docs
            .map(docDia => docDia.data().dia?.toLowerCase())
            .filter(Boolean);
          setDiasDisponibles(diasEncontrados);
  
          const diaBuscado = diaElegido || nombreHoy;
          const diaEncontrado = diasSnap.docs.find(docDia =>
            docDia.data().dia?.toLowerCase() === diaBuscado.toLowerCase()
          );
  
          if (diaEncontrado) {
            const diaData = diaEncontrado.data();
            setNombreDiaRutina(diaData.nombre || 'Sin nombre');
          } else {
            setNombreDiaRutina('Descanso');
          }
  
          setDiaActual(diaBuscado);
        } else {
          console.warn('⚠️ No hay rutina principal');
          setSinRutinaPrincipal(true);

        }
      } catch (error) {
        console.error('❌ Error obteniendo rutina:', error);
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

          const diasRef = collection(db, 'users', user.uid, 'rutinas', rutinaId, 'Dias');
          const diasSnap = await getDocs(diasRef);

          const diaEncontrado = diasSnap.docs.find(docDia =>
            docDia.data().dia?.toLowerCase() === nuevoDia.toLowerCase()
          );
          
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
        <h1 className={styles.dia}>{diaActual.charAt(0).toUpperCase() + diaActual.slice(1)}</h1>
        <button
          className={styles.changeDayIcon}
          onClick={() => setModoCambio(!modoCambio)}
          title="Cambiar Día"
        >
          🔄
        </button>
      </div>
  
      <div className={styles.contenido}>
        {sinRutinaPrincipal ? (
          <p className={styles.mensajeSutil}>
            ⚠️ No tenés una rutina principal activada.
          </p>
        ) : nombreDiaRutina === 'Descanso' ? (
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







