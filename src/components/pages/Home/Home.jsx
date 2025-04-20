import React from 'react';
import Recordatorio from './components/Recordatorio/Recordatorio';
import Concurrencia from './components/Concurrencia/Concurrencia';
import Publicaciones from './components/Publicaciones/Publicaciones';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase/config'; // Asegúrate de tener tu configuración de Firebase
import { useState, useEffect } from 'react';
function Home() {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const cargarUsuario = async () => {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(docRef);
                setUsuario(userSnap.data());
            }
        };

        cargarUsuario();
    }, []);
    return (
        
        <div>
            <Concurrencia />
            {usuario?.role !== 'admin' && (
                <Recordatorio />
            )}
            <Publicaciones usuario={usuario}/>
        </div>
    );
}

export default Home;