import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export function useRespuestas(publicacionId, comentarios) {
  const [respuestas, setRespuestas] = useState({});

  useEffect(() => {
    const cargarRespuestas = async () => {
      const nuevasRespuestas = {};
      await Promise.all(comentarios.map(async (comentario) => {
        const snap = await getDocs(
          collection(db, 'Publicaciones', publicacionId, 'comentarios', comentario.id, 'respuestas')
        );
        nuevasRespuestas[comentario.id] = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }));
      setRespuestas(nuevasRespuestas);
    };

    if (comentarios.length > 0) cargarRespuestas();
  }, [comentarios, publicacionId]);

  return [respuestas, setRespuestas];
}
