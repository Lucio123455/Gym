import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

export function useComentarios(publicacionId) {
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    const fetchComentarios = async () => {
      const snap = await getDocs(
        query(collection(db, 'Publicaciones', publicacionId, 'comentarios'), orderBy('fecha', 'asc'))
      );
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComentarios(data);
    };

    fetchComentarios();
  }, [publicacionId]);

  return [comentarios, setComentarios];
}
