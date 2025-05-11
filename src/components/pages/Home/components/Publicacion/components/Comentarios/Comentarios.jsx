import React from 'react';
import Responder from './Responder/Responder';
import styles from './Comentarios.module.css';
import { useEffect } from 'react';
import { formatearFecha } from '../../../../../../../utils/fecha';

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
  const [comentarioEliminando, setComentarioEliminando] = React.useState(null);

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
            {comentarios.map((comentario, index) => (
              <div
                key={comentario.id}
                className={`${styles.comentario} ${comentarioEliminando === comentario.id ? styles.oculto : ''}`}
              >
                <div className={styles.avatarComentario}>
                  {comentario.usuarioFotoURL ? (
                    <img
                      src={comentario.usuarioFotoURL}
                      alt="Avatar"
                      className={styles.avatarComentarioImg}
                    />
                  ) : (
                    <span className={styles.inicialComentario}>
                      {comentario.usuarioNombre?.[0] || 'U'}
                    </span>
                  )}
                </div>

                <div className={styles.cuerpoComentario}>
                  <div className={styles.comentarioHeader}>
                    <span className={styles.usuarioComentario}>
                      {comentario.usuarioNombre}
                    </span>
                    <span className={styles.fechaComentario}>
                      {formatearFecha(comentario.fecha)}
                    </span>

                    {usuario?.role === 'admin' && (
                      <button
                        className={styles.eliminarComentario}
                        onClick={() => {
                          setComentarioEliminando(comentario.id);

                          setTimeout(() => {
                            // Primero actualizamos el estado local directamente
                            setComentariosLocal((prev) => prev.filter((c) => c.id !== comentario.id));

                            // Luego llamamos al handler para que borre en Firestore
                            eliminarComentario(comentario.id);
                            setComentarioEliminando(null);
                          }, 300);
                        }}

                        title="Eliminar comentario"
                      >
                        ✖
                      </button>
                    )}
                  </div>

                  <p className={styles.textoComentario}>{comentario.texto}</p>

                  {(respuestasPorComentario[comentario.id] || []).map((resp) => (

                    <div key={resp.id} className={`${styles.comentario} ${resp._recienAgregado ? styles.nuevo : ''}`}>
                      <div className={styles.avatarComentario}>
                        {resp.usuarioFotoURL ? (
                          <img
                            src={resp.usuarioFotoURL}
                            alt="Avatar"
                            className={styles.avatarComentarioImg}
                          />
                        ) : (
                          <span className={styles.inicialComentario}>
                            {resp.usuarioNombre?.[0] || 'U'}
                          </span>
                        )}
                      </div>
                      <div className={styles.cuerpoComentario}>
                        <div className={styles.comentarioHeader}>
                          <span className={styles.usuarioComentario}>{resp.usuarioNombre}</span>
                          <span className={styles.fechaComentario}>
                            {formatearFecha(resp.fecha)}
                          </span>
                        </div>
                        <p className={styles.textoComentario}>{resp.texto}</p>
                      </div>
                    </div>
                  ))}


                  {usuario?.role === 'admin' && (
                    <Responder
                      comentarioId={comentario.id}
                      publicacionId={publicacionId}
                      setRespuestasPorComentario={setRespuestasPorComentario}
                      usuario={usuario}
                    />
                  )}
                </div>
              </div>
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
