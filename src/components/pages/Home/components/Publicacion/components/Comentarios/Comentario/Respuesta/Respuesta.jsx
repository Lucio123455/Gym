// 📁 components/Respuesta.jsx
import React from 'react';
import styles from '../../Comentarios.module.css';
import { formatearFecha } from '../../../../../../../../../utils/fecha';
import { obtenerFotoDeUsuario } from '../../../../../../../../../services/publicaciones';
import { useState, useEffect } from 'react';

export default function Respuesta({ respuesta }) {
  const [fotoURL, setFotoURL] = useState(null);

  useEffect(() => {
    const fetchFoto = async () => {
      const url = await obtenerFotoDeUsuario(respuesta.usuarioId);
      setFotoURL(url);
    };
    if (respuesta.usuarioId) fetchFoto();
  }, [respuesta.usuarioId]);

  return (
    <div className={`${styles.comentario} ${respuesta._recienAgregado ? styles.nuevo : ''}`}>
      <div className={styles.avatarComentario}>
        {fotoURL ? (
          <img
            src={fotoURL}
            alt={`Avatar de ${respuesta.usuarioNombre}`}
            className={styles.avatarComentarioImg}
          />
        ) : (
          <span className={styles.inicialComentario}>
            {respuesta.usuarioNombre?.[0] || 'U'}
          </span>
        )}
      </div>
      <div className={styles.cuerpoComentario}>
        <div className={styles.comentarioHeader}>
          <span className={styles.usuarioComentario}>{respuesta.usuarioNombre}</span>
          <span className={styles.fechaComentario}>
            {formatearFecha(respuesta.fecha)}
          </span>
        </div>
        <p className={styles.textoComentario}>{respuesta.texto}</p>
      </div>
    </div>
  );
}
