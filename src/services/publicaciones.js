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

export const agregarRespuesta = async ({ publicacionId, comentarioId, respuesta }) => {
  const nueva = {
    texto: respuesta.texto.trim(),
    usuarioNombre: respuesta.usuarioNombre || 'Anónimo',
    usuarioFotoURL: respuesta.usuarioFotoURL || '',
    fecha: new Date() // fecha local para mostrar ya mismo
  };

  try {
    const ref = await addDoc(
      collection(db, 'Publicaciones', publicacionId, 'comentarios', comentarioId, 'respuestas'),
      { ...nueva, fecha: serverTimestamp() } // en BD usamos la real
    );

    return { id: ref.id, ...nueva };
  } catch (e) {
    console.error("Error al responder:", e);
    return null;
  }
};


export const eliminarComentario = async (publicacionId, comentarioId) => {
  if (!publicacionId || !comentarioId) return false;

  try {
    const comentarioRef = doc(db, 'Publicaciones', publicacionId, 'comentarios', comentarioId);
    await deleteDoc(comentarioRef);
    return true;
  } catch (error) {
    console.error('Error al eliminar el comentario:', error);
    return false;
  }
};

export const agregarComentario = async ({ publicacionId, texto, usuario }) => {
  if (!texto.trim()) return null;

  const nuevoComentario = {
    texto: texto.trim(),
    usuarioId: usuario?.uid || 'sin-uid',
    usuarioNombre: usuario.nombre,
    usuarioFotoURL: usuario.fotoURL || '',
    fecha: new Date(), // para mostrarlo al instante
    respuestas: []
  };

  try {
    const docRef = await addDoc(
      collection(db, 'Publicaciones', publicacionId, 'comentarios'),
      {
        ...nuevoComentario,
        fecha: serverTimestamp() // Firestore lo va a sobreescribir
      }
    );

    return { id: docRef.id, ...nuevoComentario };
  } catch (error) {
    console.error('Error al agregar comentario:', error);
    return null;
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