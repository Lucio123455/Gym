import React, { useEffect, useRef, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../../../../../firebase/config';
import styles from './Responder.module.css';

export default function Responder({ comentarioIndex, publicacionId, setComentariosLocal }) {
  const [respuesta, setRespuesta] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mostrarInput, setMostrarInput] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setMostrarInput(false);
        setRespuesta('');
      }
    };

    if (mostrarInput) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mostrarInput]);

  const handleResponder = async () => {
    if (!respuesta.trim()) return;
    setEnviando(true);

    try {
      const publicacionRef = doc(db, 'Publicaciones', publicacionId);
      const publicacionSnap = await getDoc(publicacionRef);
      const data = publicacionSnap.exists() ? publicacionSnap.data() : {};
      const comentariosActuales = Array.isArray(data?.comentarios) ? data.comentarios : [];

      const actualizado = [...comentariosActuales];
      const comentario = actualizado[comentarioIndex];

      if (!comentario) throw new Error("Comentario no encontrado.");

      const respuestasActuales = Array.isArray(comentario.respuestas) ? comentario.respuestas : [];
      const nuevoComentario = {
        ...comentario,
        respuestas: [...respuestasActuales, respuesta]
      };

      actualizado[comentarioIndex] = nuevoComentario;

      await setDoc(publicacionRef, { comentarios: actualizado }, { merge: true });

      setComentariosLocal(actualizado);
      setRespuesta('');
      setMostrarInput(false);
    } catch (e) {
      console.error("Error al responder:", e);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.responderContainer} ref={inputRef}>
      {!mostrarInput ? (
        <button
          className={styles.botonResponder}
          onClick={() => setMostrarInput(true)}
        >
          Responder
        </button>
      ) : (
        <div className={`${styles.responderAnimado} ${mostrarInput ? styles.activo : ''}`}>
          <input
            type="text"
            placeholder="Responder..."
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleResponder()}
            disabled={enviando}
            autoFocus
          />
          <button
            className={styles.botonPublicar}
            onClick={handleResponder}
            disabled={!respuesta.trim() || enviando}
          >
            {enviando ? '...' : 'Enviar'}
          </button>
        </div>
      )}
    </div>
  );
}
