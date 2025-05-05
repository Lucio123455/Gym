import { IoIosSend } from 'react-icons/io';
import styles from './MessageInput.module.css';
import { useState, useRef, useEffect } from 'react';
import { collection, getDocs, setDoc, doc, where, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../../../../firebase/config';
import { showConfirm, showError, showSuccess } from '../../../../AlertService';

const MessageInput = ({
  newMessage,
  setNewMessage,
  handleKeyPress,
  sendMessage,
  currentUserRole,
  chatId,
}) => {
  const [showRutinas, setShowRutinas] = useState(false);
  const [rutinas, setRutinas] = useState([]);
  const [selectedRutina, setSelectedRutina] = useState(null);
  const [loadingAsignacion, setLoadingAsignacion] = useState(false);

  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showRutinas && modalRef.current && !modalRef.current.contains(e.target)) {
        setShowRutinas(false);
        setSelectedRutina(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showRutinas]);

  const fetchRutinas = async () => {
    const snapshot = await getDocs(collection(db, 'rutinas'));
    const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRutinas(lista);
  };

  const toggleRutinas = () => {
    if (!showRutinas) fetchRutinas();
    setShowRutinas(prev => !prev);
    setSelectedRutina(null);
  };

  const handleSelectRutina = (rutina) => {
    setSelectedRutina(rutina);
  };

  const handleAsignarRutina = async () => {
    if (!selectedRutina) return;
    if (setLoadingAsignacion) setLoadingAsignacion(true);

    const [alumnoDni] = chatId.split('_');

    try {
      // 1. Buscar UID del alumno
      const q = query(collection(db, 'users'), where('dni', '==', alumnoDni));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        showError("❌ No se encontró el alumno con ese DNI.");
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userUid = userDoc.id;

      // 2. Guardar rutina raíz
      const rutinaRef = doc(db, `users/${userUid}/rutinas/${selectedRutina.id}`);
      await setDoc(rutinaRef, selectedRutina);

      // 3. Obtener días
      const diasSnap = await getDocs(collection(db, `rutinas/${selectedRutina.id}/Dias`));

      const diaPromises = diasSnap.docs.map(async (diaDoc) => {
        const diaData = diaDoc.data();
        const diaPath = `users/${userUid}/rutinas/${selectedRutina.id}/Dias/${diaDoc.id}`;
        const diaRef = doc(db, diaPath);
        const setDia = setDoc(diaRef, diaData);

        // 4. Obtener ejercicios de este día
        const ejerciciosSnap = await getDocs(collection(db, `rutinas/${selectedRutina.id}/Dias/${diaDoc.id}/Ejercicios`));

        const ejercicioPromises = ejerciciosSnap.docs.map(async (ejDoc) => {
          const ejData = ejDoc.data();
          const ejPath = `${diaPath}/Ejercicios/${ejDoc.id}`;
          const ejRef = doc(db, ejPath);
          const setEj = setDoc(ejRef, ejData);

          // 5. Obtener series
          const seriesSnap = await getDocs(collection(db, `rutinas/${selectedRutina.id}/Dias/${diaDoc.id}/Ejercicios/${ejDoc.id}/Series`));

          const seriesPromises = seriesSnap.docs.map((serieDoc) => {
            const serieData = serieDoc.data();
            const serieRef = doc(db, `${ejPath}/Series/${serieDoc.id}`);
            return setDoc(serieRef, serieData);
          });

          // Esperar a que se creen todas las series
          await Promise.all(seriesPromises);
          return setEj;
        });

        // Esperar a que se creen todos los ejercicios + el día
        await Promise.all(ejercicioPromises);
        return setDia;
      });

      await Promise.all(diaPromises);

      // 6. Enviar mensaje especial al chat
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: '🏋️ El entrenador te asignó una nueva rutina.',
        link: '/entrenamiento/rutinas',
        timestamp: serverTimestamp(),
        tipo: 'asignacion',
      });

      showSuccess("✅ Rutina asignada con éxito");
      setShowRutinas(false);
      setSelectedRutina(null);
    } catch (error) {
      console.error("Error al asignar rutina:", error);
      showError("❌ Error al asignar rutina");
    } finally {
      if (setLoadingAsignacion) setLoadingAsignacion(false);
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Mensaje..."
          className={styles.input}
          aria-label="Escribe tu mensaje"
        />

        {loadingAsignacion && (
          <div className={styles.sutilLoading}>
            Asignando rutina...
          </div>
        )}

        <div className={styles.buttonGroup}>
          {currentUserRole === 'entrenador' && (
            <button
              className={styles.emojiButton}
              onClick={toggleRutinas}
            >
              💪
            </button>
          )}

          <button
            onClick={sendMessage}
            className={styles.sendButton}
            disabled={!newMessage.trim()}
            aria-label="Enviar mensaje"
          >
            <IoIosSend size={20} />
          </button>
        </div>
      </div>

      {showRutinas && (
        <div className={styles.modal} ref={modalRef}>
          <h4>Seleccioná una rutina</h4>
          <ul className={styles.rutinaList}>
            {rutinas.map((rutina) => (
              <li
                key={rutina.id}
                onClick={() => handleSelectRutina(rutina)}
                style={{
                  backgroundColor: selectedRutina?.id === rutina.id ? '#d0f0c0' : 'transparent'
                }}
              >
                {rutina.nombre}
              </li>
            ))}
          </ul>

          {selectedRutina && (
            <button className={styles.asignarButton} onClick={handleAsignarRutina}>
              Enviar rutina
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageInput;





