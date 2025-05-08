import React from 'react';
import styles from './AgregarComentario.module.css';

export default function AgregarComentario({
  nuevoComentario,
  setNuevoComentario,
  agregarComentario,
  loading
}) {
  return (
    <div className={styles.agregarComentario}>
      <input
        type="text"
        placeholder="Añade un comentario..."
        value={nuevoComentario}
        onChange={(e) => setNuevoComentario(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && agregarComentario()}
        disabled={loading}
      />
      {loading ? (
        <span className={styles.publicando}>Publicando...</span>
      ) : (
        <button
          className={styles.botonPublicar}
          onClick={agregarComentario}
          disabled={!nuevoComentario.trim()}
        >
          Publicar
        </button>
      )}
    </div>
  );
}
