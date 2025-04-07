import React, { useState } from 'react';
import { 
  doc, 
  updateDoc, 
  setDoc,
  arrayUnion, 
  arrayRemove,
  increment,
  getDoc
} from 'firebase/firestore';
import { db, auth } from '../../../../../firebase/config';
import styles from './Publicacion.module.css';

function Publicacion({ publicacion }) {
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const currentUser = auth.currentUser;

  // Verificar si el usuario ya dio like
  const usuarioDioLike = publicacion.likesUsuarios?.includes(currentUser?.uid) || false;

  const handleLike = async () => {
    if (!currentUser) return;
    
    const publicacionRef = doc(db, 'Publicaciones', publicacion.id);
    
    try {
      // Verificar si el documento existe
      const docSnap = await getDoc(publicacionRef);
      
      if (!docSnap.exists()) {
        // Crear documento si no existe
        await setDoc(publicacionRef, {
          likes: usuarioDioLike ? 0 : 1,
          likesUsuarios: usuarioDioLike ? [] : [currentUser.uid],
          comentarios: publicacion.comentarios || [],
          autor: publicacion.autor || 'Anónimo',
          imagen: publicacion.imagen || '',
          descripcion: publicacion.descripcion || '',
          fecha: publicacion.fecha || new Date().toISOString()
        });
        return;
      }

      if (usuarioDioLike) {
        await updateDoc(publicacionRef, {
          likes: increment(-1),
          likesUsuarios: arrayRemove(currentUser.uid)
        });
      } else {
        await updateDoc(publicacionRef, {
          likes: increment(1),
          likesUsuarios: arrayUnion(currentUser.uid)
        });
      }
    } catch (error) {
      console.error("Error al actualizar like:", error);
    }
  };

  const agregarComentario = async () => {
    if (!nuevoComentario.trim() || !currentUser) return;
    
    const publicacionRef = doc(db, 'Publicaciones', publicacion.id);
    const comentario = {
      texto: nuevoComentario,
      usuarioId: currentUser.uid,
      usuarioNombre: currentUser.email || 'Anónimo',
      fecha: new Date().toISOString()
    };
    
    try {
      // Usar setDoc con merge: true para crear el documento si no existe
      await setDoc(publicacionRef, {
        comentarios: arrayUnion(comentario),
        // Campos por defecto si es nuevo documento
        likes: publicacion.likes || 0,
        likesUsuarios: publicacion.likesUsuarios || [],
        autor: publicacion.autor || 'Anónimo',
        imagen: publicacion.imagen || '',
        descripcion: publicacion.descripcion || '',
        fecha: publicacion.fecha || new Date().toISOString()
      }, { merge: true });
      
      setNuevoComentario('');
    } catch (error) {
      console.error("Error al agregar comentario:", error);
    }
  };

  // Resto del componente permanece igual...
  return (
    <div className={styles.publicacionContainer}>
      {/* Encabezado */}
      <div className={styles.encabezado}>
        <div className={styles.autorInfo}>
          <div className={styles.avatar}></div>
          <span className={styles.nombreAutor}>{publicacion.autor}</span>
        </div>
        <span className={styles.fecha}>
          {new Date(publicacion.fecha).toLocaleDateString()}
        </span>
      </div>

      {/* Imagen */}
      <div className={styles.contenidoImagen}>
        <img
          src={publicacion.imagen}
          className={styles.imagen}
          alt={`Publicación de ${publicacion.autor}`}
        />
      </div>

      {/* Acciones */}
      <div className={styles.acciones}>
        <button 
          className={styles.botonAccion}
          onClick={handleLike}
          style={{ color: usuarioDioLike ? 'red' : 'inherit' }}
        >
          {usuarioDioLike ? '❤️' : '🤍'}
        </button>
        <button 
          className={styles.botonAccion}
          onClick={() => setMostrarComentarios(!mostrarComentarios)}
        >
          💬
        </button>
      </div>

      {/* Likes */}
      <div className={styles.likes}>
        <span>{publicacion.likes || 0} me gusta</span>
      </div>

      {/* Descripción */}
      <div className={styles.descripcion}>
        <span>{publicacion.descripcion}</span>
      </div>

      {/* Comentarios */}
      {publicacion.comentarios?.length > 0 && (
        <div className={styles.comentarios}>
          {!mostrarComentarios ? (
            <button 
              className={styles.verComentarios}
              onClick={() => setMostrarComentarios(true)}
            >
              Ver los {publicacion.comentarios.length} comentarios
            </button>
          ) : (
            <>
              {publicacion.comentarios.map((comentario, index) => (
                <div key={index} className={styles.comentario}>
                  <span className={styles.usuarioComentario}>
                    {comentario.usuarioNombre}
                  </span>
                  <span>{comentario.texto}</span>
                </div>
              ))}
              <button 
                className={styles.ocultarComentarios}
                onClick={() => setMostrarComentarios(false)}
              >
                Ocultar comentarios
              </button>
            </>
          )}
        </div>
      )}

      {/* Añadir comentario */}
      <div className={styles.agregarComentario}>
        <input 
          type="text" 
          placeholder="Añade un comentario..." 
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && agregarComentario()}
        />
        <button 
          className={styles.botonPublicar}
          onClick={agregarComentario}
          disabled={!nuevoComentario.trim()}
        >
          Publicar
        </button>
      </div>
    </div>
  );
}

export default Publicacion;