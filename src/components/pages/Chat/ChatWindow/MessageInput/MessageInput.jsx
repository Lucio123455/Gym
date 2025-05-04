import { IoIosSend } from 'react-icons/io';
import styles from './MessageInput.module.css';
import { useState, useEffect } from 'react';
import { collection, getDocs, setDoc, doc, where, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../../../../firebase/config';

const MessageInput = ({
  newMessage,
  setNewMessage,
  handleKeyPress,
  sendMessage,
  currentUserRole,
  chatId
}) => {
  const [showRutinas, setShowRutinas] = useState(false);
  const [rutinas, setRutinas] = useState([]);
  const [selectedRutina, setSelectedRutina] = useState(null);

  const fetchRutinas = async () => {
    const snapshot = await getDocs(collection(db, 'rutinas'));
    const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRutinas(lista);
  };

  const toggleRutinas = () => {
    if (!showRutinas) fetchRutinas();
    setShowRutinas(prev => !prev);
    setSelectedRutina(null); // limpiar selección si se vuelve a abrir
  };

  const handleSelectRutina = (rutina) => {
    setSelectedRutina(rutina);
  };


  const handleAsignarRutina = async () => {
    if (!selectedRutina) return;

    const [alumnoDni] = chatId.split('_'); // el primero es siempre el alumno

    try {
      // Buscar el usuario cuyo dni coincida con el del alumno
      const q = query(collection(db, 'users'), where('dni', '==', alumnoDni));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("❌ No se encontró el alumno con ese DNI.");
        return;
      }

      const userDoc = querySnapshot.docs[0]; // único resultado esperado
      const userUid = userDoc.id;

      // Guardar la rutina en users/{uid}/rutinas
      await setDoc(
        doc(db, `users/${userUid}/rutinas`, selectedRutina.id),
        selectedRutina
      );

      alert("✅ Rutina asignada con éxito");
      setShowRutinas(false);
      setSelectedRutina(null);
    } catch (error) {
      console.error("Error al asignar rutina:", error);
      alert("❌ Error al asignar rutina");
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

      {/* Modal para seleccionar rutina */}
      {showRutinas && (
        <div className={styles.modal}>
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




