import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';

import { useComentarios } from '../../../../../hooks/useComentarios.js';
import { useRespuestas } from '../../../../../hooks/useRespuestas.js';

import styles from './Publicacion.module.css';

import {
  agregarComentario,
  eliminarComentario,
  eliminarPublicacion
} from '../../../../../services/publicaciones';

import {
  confirmDeletionDialog,
  showToastSuccess,
  showToastError
} from '../../../../../utils/AlertService.js';

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
  const [comentariosLocal, setComentariosLocal] = useComentarios(publicacion.id);
  const [respuestasPorComentario, setRespuestasPorComentario] = useRespuestas(publicacion.id, comentariosLocal);
  const [ocultar, setOcultar] = useState(false);

  // Animación al mostrar comentarios
  useEffect(() => {
    if (mostrarComentarios) {
      const timeout = setTimeout(() => setAnimarComentarios(true), 10);
      return () => clearTimeout(timeout);
    } else {
      setAnimarComentarios(false);
    }
  }, [mostrarComentarios]);

  // Manejo de eliminación de comentario
  const eliminarComentarioHandler = async (comentarioId) => {
    const ok = await eliminarComentario(publicacion.id, comentarioId);

    if (ok) {
      setComentariosLocal((prev) => prev.filter(c => c.id !== comentarioId));
      showToastSuccess('Comentario eliminado');
    } else {
      showToastError('No se pudo eliminar el comentario');
    }
  };

  // Manejo de agregar comentario
  const agregarComentarioHandler = async () => {
    if (loadingComentario || !nuevoComentario.trim()) return;

    setLoadingComentario(true);

    const nuevo = await agregarComentario({
      publicacionId: publicacion.id,
      texto: nuevoComentario.trim(),
      usuario
    });

    if (nuevo) {
      setComentariosLocal((prev) => [...prev, nuevo]);
      setNuevoComentario('');
      setMostrarComentarios(true);
    }

    setLoadingComentario(false);
  };

  // Manejo de eliminación de publicación
  const eliminarPublicacionHandler = async () => {
    const confirmado = await confirmDeletionDialog(
      '¿Estás seguro?',
      'Esta acción eliminará la publicación para siempre.'
    );

    if (!confirmado) return;

    setOcultar(true);

    setTimeout(async () => {
      const ok = await eliminarPublicacion(publicacion.id);

      if (ok) {
        showToastSuccess('Publicación eliminada');
        // Podrías usar un callback desde props para eliminarla del estado superior
      } else {
        showToastError('No se pudo eliminar la publicación');
        setOcultar(false); // Volver a mostrar si falló
      }
    }, 300); // tiempo de animación
  };

  return (
    <div className={`${styles.publicacionContainer} ${ocultar ? styles.publicacionOculta : ''}`}>
      <Encabezado
        usuario={usuario}
        publicacion={publicacion}
        eliminarPublicacion={eliminarPublicacionHandler}
        fecha={publicacion.fecha}
      />

      <ImagenPublicacion
        src={publicacion.imagen}
        videoUrl={publicacion.video}
        alt={`Publicación de ${publicacion.autor}`}
        mutedGlobal={mutedGlobal}
        setMutedGlobal={setMutedGlobal}
      />

      <Descripcion texto={publicacion.descripcion} />

      <Comentarios
        comentarios={comentariosLocal}
        respuestasPorComentario={respuestasPorComentario}
        setRespuestasPorComentario={setRespuestasPorComentario}
        mostrar={mostrarComentarios}
        setMostrar={setMostrarComentarios}
        animar={animarComentarios}
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




