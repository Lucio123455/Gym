import React, { useState, useRef, useEffect } from 'react';
import {
    doc,
    setDoc,
    arrayUnion,
    getDoc
} from 'firebase/firestore';
import { db, auth } from '../../../../../firebase/config';
import styles from './Publicacion.module.css';

const Encabezado = ({ autor, fecha }) => (
    <div className={styles.encabezado}>
        <div className={styles.autorInfo}>
            <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzPs0ng1OihF-_SsKH3o2j2ThKJa21zWYlmg&s"
                alt="Avatar del autor"
                className={styles.avatar}
            />
            <span className={styles.nombreAutor}>Will Power Gym</span>
        </div>
        <span className={styles.fecha}>
            {new Date(fecha).toLocaleDateString()}
        </span>
    </div>
);

const ImagenPublicacion = ({ src, alt }) => (
    <div className={styles.contenidoImagen}>
        <img src={src} className={styles.imagen} alt={alt} />
    </div>
);

const Descripcion = ({ texto }) => (
    <div className={styles.descripcion}>
        <span>{texto}</span>
    </div>
);

const Comentarios = ({
    comentarios,
    mostrar,
    setMostrar,
    animar,
    refContenedor
}) => (
    comentarios.length > 0 && (
        <div className={styles.comentarios}>
            {!mostrar ? (
                <button
                    className={styles.verComentarios}
                    onClick={() => setMostrar(true)}
                >
                    Ver los {comentarios.length} comentarios
                </button>
            ) : (
                <>
                    <div
                        ref={refContenedor}
                        className={`${styles.comentariosAnimados} ${animar ? styles.activo : ''}`}
                    >
                        {comentarios.map((comentario, index) => (
                            <div key={index} className={styles.comentario}>
                                <span className={styles.usuarioComentario}>
                                    {comentario.usuarioNombre}
                                </span>
                                <span>{comentario.texto}</span>
                            </div>
                        ))}
                    </div>
                    <button
                        className={styles.ocultarComentarios}
                        onClick={() => setMostrar(false)}
                    >
                        Ocultar comentarios
                    </button>
                </>
            )}
        </div>
    )
);

const AgregarComentario = ({
    nuevoComentario,
    setNuevoComentario,
    agregarComentario,
    loading
}) => (
    <div className={styles.agregarComentario}>
        <input
            type="text"
            placeholder="Añade un comentario..."
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && agregarComentario()}
            disabled={loading}
        />
        {loading ? (
            <span className={styles.publicando}>Publicando...</span>
        ) : (
            <button
                className={styles.botonPublicar}
                onClick={agregarComentario}
                disabled={!nuevoComentario.trim()}
            >
                Publicar
            </button>
        )}
    </div>
);


function Publicacion({ publicacion }) {
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [mostrarComentarios, setMostrarComentarios] = useState(false);
    const [animarComentarios, setAnimarComentarios] = useState(false);
    const [loadingComentario, setLoadingComentario] = useState(false);
    const [comentariosLocal, setComentariosLocal] = useState(publicacion.comentarios || []);

    const currentUser = auth.currentUser;
    const comentariosRef = useRef(null);

    useEffect(() => {
        if (mostrarComentarios) {
            const timeout = setTimeout(() => setAnimarComentarios(true), 10);
            return () => clearTimeout(timeout);
        } else {
            setAnimarComentarios(false);
        }
    }, [mostrarComentarios]);

    const agregarComentario = async () => {
        if (!nuevoComentario.trim() || !currentUser) return;

        setLoadingComentario(true);
        const publicacionRef = doc(db, 'Publicaciones', publicacion.id);

        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            const userData = userDocSnap.exists() ? userDocSnap.data() : {};
            const nombreUsuario = userData.nombre || 'Anónimo';

            const nuevo = {
                texto: nuevoComentario,
                usuarioId: currentUser.uid,
                usuarioNombre: nombreUsuario,
                fecha: new Date().toISOString()
            };

            // Agregamos el comentario a la UI de inmediato
            setComentariosLocal(prev => [...prev, nuevo]);

            await setDoc(publicacionRef, {
                comentarios: arrayUnion(nuevo),
                autor: publicacion.autor || 'Anónimo',
                imagen: publicacion.imagen || '',
                descripcion: publicacion.descripcion || '',
                fecha: publicacion.fecha || new Date().toISOString()
            }, { merge: true });

            setNuevoComentario('');
        } catch (error) {
            console.error("Error al agregar comentario:", error);
        } finally {
            setLoadingComentario(false);
        }
    };

    return (
        <div className={styles.publicacionContainer}>
            <Encabezado autor={publicacion.autor} fecha={publicacion.fecha} />
            <ImagenPublicacion
                src={publicacion.imagen}
                alt={`Publicación de ${publicacion.autor}`}
            />
            <Descripcion texto={publicacion.descripcion} />
            <Comentarios
                comentarios={comentariosLocal}
                mostrar={mostrarComentarios}
                setMostrar={setMostrarComentarios}
                animar={animarComentarios}
                refContenedor={comentariosRef}
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


