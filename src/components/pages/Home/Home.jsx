import React from 'react';
import Publicaciones from './components/Publicaciones/Publicaciones';
import { useUsuario } from '../../../context/UsuarioContext';
import { usePublicaciones } from '../../../hooks/usePublicaiones.js';
import Loading from '../../Loading/Loading';

function Home() {
  const { usuario, loadingUsuario } = useUsuario();
  const { publicaciones, loading, error } = usePublicaciones();

  // Usás tu loader global si algo no está listo
  if (loading || loadingUsuario) return <Loading />;
  if (error) return <div>{error}</div>;

  return <Publicaciones publicaciones={publicaciones} usuario={usuario} />;
}

export default Home;

