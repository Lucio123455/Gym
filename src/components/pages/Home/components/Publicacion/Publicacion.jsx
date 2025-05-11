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
  agregarComentarioEnPublicacion,
  eliminarPublicacion
} from '../../../../../services/publicaciones';
import { confirmDeletionDialog, showToastSuccess, showToastError } from '../../../../../utils/AlertService.js'

import Encabezado from './components/Encabezado/Encabezado.jsx';
import ImagenPublicacion from './components/ImagenPublicacion/ImagenPublicacion.jsx';
import Descripcion from './components/Descripcion/Descripcion.jsx';
import Comentarios from './components/Comentarios/Comentarios.jsx';
import AgregarComentario from './components/AgregarComentario/AgregarComentario.jsx';

function Publicacion({ publicacion, usuario, mutedGlobal,setMutedGlobal }) {
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [animarComentarios, setAnimarComentarios] = useState(false);
  const [loadingComentario, setLoadingComentario] = useState(false);
  const [comentariosLocal, setComentariosLocal] = useState([]);
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

  const agregarComentario = () =>
    agregarComentarioEnPublicacion({
      publicacionId: publicacion.id,
      texto: nuevoComentario,
      usuario,
      setLoading: setLoadingComentario,
      setNuevoComentario
    });

  const eliminarPublicacionHandler = async () => {
    const confirmado = await confirmDeletionDialog(
      '¿Estás seguro?',
      'Esta acción eliminará la publicación para siempre.'
    );

    if (!confirmado) return;

    const ok = await eliminarPublicacion(publicacion.id);

    if (ok) {
      showToastSuccess('Publicación eliminada');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } else {
      showToastError('No se pudo eliminar la publicación');
    }
  };



  return (
    <div className={styles.publicacionContainer}>
      <Encabezado usuario={usuario} publicacion={publicacion} eliminarPublicacion={eliminarPublicacionHandler} fecha={publicacion.fecha} />
      <ImagenPublicacion src={publicacion.imagen} videoUrl={publicacion.video} alt={`Publicación de ${publicacion.autor}`} mutedGlobal={mutedGlobal} setMutedGlobal={setMutedGlobal} />
      <Descripcion texto={publicacion.descripcion} />
      <Comentarios
        comentarios={comentariosLocal}
        mostrar={mostrarComentarios}
        setMostrar={setMostrarComentarios}
        animar={animarComentarios}
        refContenedor={comentariosRef}
        publicacionId={publicacion.id}
        setComentariosLocal={setComentariosLocal}
        usuario={usuario}
      />
      <AgregarComentario
        nuevoComentario={nuevoComentario}
        setNuevoComentario={setNuevoComentario}
        agregarComentario={agregarComentario}
        loading={loadingComentario}
      />
    </div>
  );
}

export default Publicacion;



