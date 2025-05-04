import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../../../../../firebase/config';
import CartaRutina from './CartaRutina/CartaRutina';
import styles from './Rutinas.module.css';

export default function Rutinas() {
    const [rutinas, setRutinas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [verPublicas, setVerPublicas] = useState(false);

    // ⚡ Rutinas públicas (de momento hardcodeadas)
    const rutinasPublicas = [
        { id: 'pub1', nombre: 'Full Body Básico' },
        { id: 'pub2', nombre: 'Push Pull Legs' },
        { id: 'pub3', nombre: 'Hipertrofia Avanzada' },
    ];

    useEffect(() => {
        const fetchRutinas = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const ref = collection(db, `users/${user.uid}/rutinas`);
            const snap = await getDocs(ref);
            const lista = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRutinas(lista);
            setLoading(false);
        };

        fetchRutinas();
    }, []);

    const handleTogglePublicas = () => {
        setVerPublicas(!verPublicas);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.titulo}>
                    {verPublicas ? 'Rutinas públicas' : 'Tus rutinas'}
                </h2>
                <button className={styles.toggleButton} onClick={handleTogglePublicas}>
                    {verPublicas ? 'Ver mis rutinas' : 'Ver rutinas públicas'}
                </button>
            </div>

            {loading && !verPublicas ? (
                <p className={styles.estado}>Cargando tus rutinas...</p>
            ) : !verPublicas && rutinas.length === 0 ? (
                <p className={styles.estado}>No tenés rutinas asignadas.</p>
            ) : (
                <div className={styles.lista}>
                    {(verPublicas ? rutinasPublicas : rutinas).map((rutina) => (
                        <CartaRutina
                            key={rutina.id}
                            rutina={rutina}
                            esPublica={verPublicas}
                        />
                    ))}

                </div>
            )}
        </div>
    );
}


