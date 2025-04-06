import React from 'react';
import Recordatorio from './components/Recordatorio/Recordatorio';
import Concurrencia from './components/Concurrencia/Concurrencia';
import Publicaciones from './components/Publicaciones/Publicaciones';

function Home() {
    return (
        <div>
            <Concurrencia />
            <Recordatorio />
            <Publicaciones />
        </div>
    );
}

export default Home;