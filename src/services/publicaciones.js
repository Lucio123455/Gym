// 📁 src/services/publicaciones.js
import {
  db,
  addDoc,
  serverTimestamp,
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc
} from '../firebase/config.js';

import { getAuth } from 'firebase/auth';

export const crearPublicacion = async ({ descripcion, mediaUrl, mediaType, usuario }) => {
    const uid = getAuth().currentUser?.uid || 'sin-id'; // ✅ esto es dinámico

  try {
    const nuevaPublicacion = {
      descripcion,
      fecha: new Date().toISOString(),
      autor: usuario.nombre,
      usuarioId: uid,
      imagen: mediaType === 'image' ? mediaUrl : '',
      video: mediaType === 'video' ? mediaUrl : ''
    };

    await addDoc(collection(db, 'Publicaciones'), nuevaPublicacion);
    return { success: true };
  } catch (error) {
    console.error('Error al crear publicación:', error);
    return { success: false, error };
  }
};

export const getPublicaciones = async () => {
  const snap = await getDocs(collection(db, 'Publicaciones'));
  const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
};

export const obtenerFotoDeUsuario = async (uid) => {
  if (!uid) return null;

  try {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    const data = snap.data();
    console.log(data.fotoURL)
    return data.fotoURL || null;
  } catch (error) {
    console.error("Error al obtener foto de usuario:", error);
    return null;
  }
  
};


export const agregarRespuesta = async ({ publicacionId, comentarioId, respuesta }) => {
  const uid = getAuth().currentUser?.uid || 'sin-id'; // ✅ esto es dinámico
  
  const nueva = {
    texto: respuesta.texto.trim(),
    usuarioNombre: respuesta.usuarioNombre || 'Anónimo',
    usuarioId: uid,
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

  const uid = getAuth().currentUser?.uid || 'sin-id'; // ✅ esto es dinámico

  const nuevoComentario = {
    texto: texto.trim(),
    usuarioId: uid,
    usuarioNombre: usuario.nombre,
    fecha: new Date(), // UX inmediata
    respuestas: []
  };

  try {
    const docRef = await addDoc(
      collection(db, 'Publicaciones', publicacionId, 'comentarios'),
      {
        ...nuevoComentario,
        fecha: serverTimestamp() // timestamp real
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