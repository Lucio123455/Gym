import React, { useEffect, useRef, useState } from 'react';

import styles from './Responder.module.css';
import { agregarRespuesta } from '../../../../../../../../services/publicaciones';

export default function Responder({ comentarioId, publicacionId, setRespuestasPorComentario, usuario }) {
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

    const nuevaRespuesta = await agregarRespuesta({
      publicacionId,
      comentarioId,
      respuesta: {
        texto: respuesta,
        usuarioNombre: usuario.nombre,
        usuarioFotoURL: usuario.fotoURL
      }
    });

    if (nuevaRespuesta) {
      // Añadir la respuesta visualmente al estado
      setRespuestasPorComentario(prev => ({
        ...prev,
        [comentarioId]: [...(prev[comentarioId] || []), { ...nuevaRespuesta, _recienAgregado: true }]
      }));

      setMostrarInput(false);
      setRespuesta('');
    }


    setEnviando(false);
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
