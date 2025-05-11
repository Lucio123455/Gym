import React, { useState, useRef, useEffect } from 'react';
import {
  collection,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../../../../../firebase/config';
import styles from './Publicacion.module.css';
import {
  agregarComentario,
  eliminarPublicacion,
  eliminarComentario

} from '../../../../../services/publicaciones';
import { confirmDeletionDialog, showToastSuccess, showToastError } from '../../../../../utils/AlertService.js'

import Encabezado from './components/Encabezado/Encabezado.jsx';
import ImagenPublicacion from './components/ImagenPublicacion/ImagenPublicacion.jsx';
import Descripcion from './components/Descripcion/Descripcion.jsx';
import Comentarios from './components/Comentarios/Comentarios.jsx';
import AgregarComentario from './components/AgregarComentario/AgregarComentario.jsx';

function Publicacion({ publicacion, usuario, mutedGlobal, setMutedGlobal }) {
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [animarComentarios, setAnimarComentarios] = useState(false);
  const [loadingComentario, setLoadingComentario] = useState(false);
  const [comentariosLocal, setComentariosLocal] = useState([]);
  const [ocultar, setOcultar] = useState(false);
  const [respuestasPorComentario, setRespuestasPorComentario] = useState({});


  const comentariosRef = useRef(null);

  useEffect(() => {
    if (mostrarComentarios) {
      const timeout = setTimeout(() => setAnimarComentarios(true), 10);
      return () => clearTimeout(timeout);
    } else {
      setAnimarComentarios(false);
    }
  }, [mostrarComentarios]);

  useEffect(() => {
    const fetchComentarios = async () => {
      const comentariosSnap = await getDocs(
        query(collection(db, 'Publicaciones', publicacion.id, 'comentarios'), orderBy('fecha', 'asc'))
      );
      const data = comentariosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComentariosLocal(data);
    };

    fetchComentarios();
  }, [publicacion.id]);

  useEffect(() => {
  const cargarRespuestas = async () => {
    const nuevasRespuestas = {};

    for (const comentario of comentariosLocal) {
      const snap = await getDocs(
        collection(db, 'Publicaciones', publicacion.id, 'comentarios', comentario.id, 'respuestas')
      );
      nuevasRespuestas[comentario.id] = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    setRespuestasPorComentario(nuevasRespuestas);
  };

  if (comentariosLocal.length > 0) {
    cargarRespuestas();
  }
}, [comentariosLocal]);


  const eliminarComentarioHandler = async (comentarioId) => {
    const ok = await eliminarComentario(publicacion.id, comentarioId);

    if (ok) {
      setComentariosLocal((prev) => prev.filter(c => c.id !== comentarioId));
      showToastSuccess('Comentario eliminado');
    } else {
      showToastError('No se pudo eliminar el comentario');
    }
  };

  const agregarComentarioHandler = async () => {
    if (loadingComentario) return;

    setLoadingComentario(true);

    const nuevo = await agregarComentario({
      publicacionId: publicacion.id,
      texto: nuevoComentario,
      usuario
    });

    if (nuevo) {
      setComentariosLocal((prev) => [...prev, nuevo]);
      setNuevoComentario('');
    }

    setMostrarComentarios(true)
    setLoadingComentario(false);
  };



  const eliminarPublicacionHandler = async () => {
    const confirmado = await confirmDeletionDialog(
      '¿Estás seguro?',
      'Esta acción eliminará la publicación para siempre.'
    );

    if (!confirmado) return;

    // 🔁 Activar animación
    setOcultar(true);

    setTimeout(async () => {
      const ok = await eliminarPublicacion(publicacion.id);

      if (ok) {
        showToastSuccess('Publicación eliminada');
        // 🔁 Si usás setPublicaciones afuera, acá podés avisar con callback
      } else {
        showToastError('No se pudo eliminar la publicación');
        setOcultar(false); // volver a mostrar si falló
      }
    }, 300); // tiempo de animación
  };

  return (
    <div className={`${styles.publicacionContainer} ${ocultar ? styles.publicacionOculta : ''}`}>
      <Encabezado usuario={usuario} publicacion={publicacion} eliminarPublicacion={eliminarPublicacionHandler} fecha={publicacion.fecha} />
      <ImagenPublicacion src={publicacion.imagen} videoUrl={publicacion.video} alt={`Publicación de ${publicacion.autor}`} mutedGlobal={mutedGlobal} setMutedGlobal={setMutedGlobal} />
      <Descripcion texto={publicacion.descripcion} />
      <Comentarios
        comentarios={comentariosLocal}
        respuestasPorComentario={respuestasPorComentario}
        setRespuestasPorComentario={setRespuestasPorComentario}
        mostrar={mostrarComentarios}
        setMostrar={setMostrarComentarios}
        animar={animarComentarios}
        refContenedor={comentariosRef}
        publicacionId={publicacion.id}
        setComentariosLocal={setComentariosLocal}
        usuario={usuario}
        eliminarComentario={eliminarComentarioHandler}
      />
      <AgregarComentario
        nuevoComentario={nuevoComentario}
        setNuevoComentario={setNuevoComentario}
        agregarComentario={agregarComentarioHandler}
        loading={loadingComentario}
      />
    </div>
  );
}

export default Publicacion;



