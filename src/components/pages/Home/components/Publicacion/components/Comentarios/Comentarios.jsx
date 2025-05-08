import React from 'react';
import Responder from './Responder/Responder';
import styles from './Comentarios.module.css';

export default function Comentarios({
  comentarios,
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
            {comentarios.map((comentario, index) => (
              <div key={index} className={styles.comentario}>
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
                      {new Date(comentario.fecha).toLocaleDateString('es-AR')}
                    </span>

                    {usuario?.role === 'admin' && (
                      <button
                        className={styles.eliminarComentario}
                        onClick={() => eliminarComentario(index)}
                        title="Eliminar comentario"
                      >
                        ✖
                      </button>
                    )}
                  </div>

                  <p className={styles.textoComentario}>{comentario.texto}</p>

                  {comentario.respuestas?.map((resp, i) => (
                    <div key={i} className={styles.comentario}>
                      <div className={styles.avatarComentario}>
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzPs0ng1OihF-_SsKH3o2j2ThKJa21zWYlmg&s"
                          alt="Avatar"
                          className={styles.avatarComentarioImg}
                        />
                      </div>
                      <div className={styles.cuerpoComentario}>
                        <div className={styles.comentarioHeader}>
                          <span className={styles.usuarioComentario}>Will Power Gym</span>
                          <span className={styles.fechaComentario}>
                            {new Date().toLocaleDateString('es-AR')}
                          </span>
                        </div>
                        <p className={styles.textoComentario}>{resp}</p>
                      </div>
                    </div>
                  ))}

                  {usuario?.role === 'admin' && (
                    <Responder
                      comentarioIndex={index}
                      publicacionId={publicacionId}
                      setComentariosLocal={setComentariosLocal}
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
