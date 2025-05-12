import React, { useEffect, useState } from 'react';
import styles from './Encabezado.module.css';
import { formatearFecha } from '../../../../../../../utils/fecha';
import { obtenerFotoDeUsuario } from '../../../../../../../services/publicaciones';

export default function Encabezado({ usuario, publicacion, eliminarPublicacion, fecha }) {
  const [fotoURL, setFotoURL] = useState(null);

  useEffect(() => {
    const fetchFoto = async () => {
      const url = await obtenerFotoDeUsuario(publicacion.usuarioId);
      setFotoURL(url);
    };
    if (publicacion.usuarioId) fetchFoto();
  }, [publicacion.usuarioId]);

  return (
    <div className={styles.encabezado}>
      <div className={styles.autorInfo}>
        <img
          src={fotoURL || '/default-avatar.png'} // fallback si no carga
          alt={`Avatar de ${publicacion.autor}`}
          className={styles.avatar}
        />
        <span className={styles.nombreAutor}>{publicacion.autor}</span>
      </div>

      <div className={styles.fechaYBoton}>
        <span className={styles.fecha}>
          {formatearFecha(fecha)}
        </span>

        {usuario?.role === 'admin' && (
          <button className={styles.botonEliminar} onClick={eliminarPublicacion}>
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}



