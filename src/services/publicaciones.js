// 📁 src/services/publicaciones.js
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export const getPublicaciones = async () => {
  const snap = await getDocs(collection(db, 'Publicaciones'));
  const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
};
