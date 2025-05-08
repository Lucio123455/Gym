import React from 'react';
import Publicaciones from './components/Publicaciones/Publicaciones';
import { useUsuario } from '../../../context/UsuarioContext';

function Home({publicaciones}) {
    const { usuario, loadingUsuario } = useUsuario();

    return (
        <>
            <Publicaciones publicaciones={publicaciones} usuario={usuario} />
        </>
    );
}

export default Home;
