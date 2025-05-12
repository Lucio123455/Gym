import React from 'react';
import Responder from './Responder/Responder';
import styles from './Comentarios.module.css';
import { useEffect } from 'react';
import { formatearFecha } from '../../../../../../../utils/fecha';
import Comentario from './Comentario/Comentario';

import { obtenerFotoDeUsuario } from '../../../../../../../services/publicaciones';

export default function Comentarios({
  respuestasPorComentario,
  comentarios,
  setRespuestasPorComentario,
  mostrar,
  setMostrar,
  animar,
  refContenedor,
  publicacionId,
  setComentariosLocal,
  usuario,
  eliminarComentario
}) {
  if (!comentarios.length) return null;

  return (
    <div className={styles.comentarios}>
      {!mostrar ? (
        <button
          className={styles.verComentarios}
          onClick={() => setMostrar(true)}
        >
          Ver los {comentarios.length} comentarios
        </button>
      ) : (
        <>
          <div
            ref={refContenedor}
            className={`${styles.comentariosAnimados} ${animar ? styles.activo : ''}`}
          >
            {comentarios.map((comentario) => (
              <Comentario
                key={comentario.id}
                comentario={comentario}
                respuestas={respuestasPorComentario[comentario.id] || []}
                publicacionId={publicacionId}
                usuario={usuario}
                setComentariosLocal={setComentariosLocal}
                setRespuestasPorComentario={setRespuestasPorComentario}
                onEliminar={(id) => {
                  setComentariosLocal(prev => prev.filter(c => c.id !== id));
                  eliminarComentario(id);
                }}
              />
            ))}
          </div>

          <button
            className={styles.ocultarComentarios}
            onClick={() => setMostrar(false)}
          >
            Ocultar comentarios
          </button>
        </>
      )}
    </div>
  );

}
