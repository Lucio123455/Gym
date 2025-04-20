import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../../../firebase/config'; // Asegúrate de tener tu configuración de Firebase
import Publicacion from '../Publicacion/Publicacion';
import styles from './Publicaciones.module.css'; // Asegúrate de tener tu CSS para estilos


function Publicaciones({usuario}) {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  console.log(usuario)

  useEffect(() => {
    const fetchPublicaciones = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Publicaciones'));
        const publicacionesData = [];

        querySnapshot.forEach((doc) => {
          publicacionesData.push({
            id: doc.id,
            ...doc.data()
          });
        });

        // Ordenar por fecha (asumiendo que tienes un campo 'fecha')
        publicacionesData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        setPublicaciones(publicacionesData);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener publicaciones:", err);
        setError("Error al cargar publicaciones");
        setLoading(false);
      }
    };

    fetchPublicaciones();
  }, []);

  if (loading) {
    return <div>Cargando publicaciones...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (publicaciones.length === 0) {
    return <div>No hay publicaciones disponibles</div>;
  }

  return (
    <div className={styles.publicacionesContainer}>
      {publicaciones.map((publicacion) => (
        <Publicacion key={publicacion.id} publicacion={publicacion} usuario={usuario} />
      ))}
    </div>
  );
}

export default Publicaciones;