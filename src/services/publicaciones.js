// 📁 src/services/publicaciones.js
import {
  db,
  addDoc,
  serverTimestamp,
  collection,
  getDocs,
  doc,
  deleteDoc
} from '../firebase/config.js';

export const getPublicaciones = async () => {
  const snap = await getDocs(collection(db, 'Publicaciones'));
  const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
};

export const agregarComentarioEnPublicacion = async ({
  publicacionId,
  texto,
  usuario,
  setLoading,
  setNuevoComentario
}) => {
  if (!texto.trim()) return;

  setLoading(true);
  try {
    const nuevo = {
      texto,
      usuarioId: usuario.id || 'desconocido',
      usuarioNombre: usuario.nombre || 'Anónimo',
      fecha: serverTimestamp(),
      respuestas: []
    };

    await addDoc(collection(db, 'Publicaciones', publicacionId, 'comentarios'), nuevo);
    setNuevoComentario('');
  } catch (error) {
    console.error("Error al agregar comentario:", error);
    mostrarError("No se pudo agregar el comentario.");
  } finally {
    setLoading(false);
  }
};

export const eliminarPublicacion = async (publicacionId) => {
  try {
    await deleteDoc(doc(db, 'Publicaciones', publicacionId));
    console.log(`✅ Publicación eliminada: ID = ${publicacionId}`);
    return true;
  } catch (error) {
    console.error("❌ Error al eliminar publicación:", error);
    return false;
  }
};