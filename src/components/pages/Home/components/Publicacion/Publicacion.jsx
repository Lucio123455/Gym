import React, { useState, useRef, useEffect } from 'react';
import {
    doc,
    setDoc,
    arrayUnion,
    getDoc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore';
import { db, auth } from '../../../../../firebase/config';
import styles from './Publicacion.module.css';
import { confirmarEliminacion, mostrarExito, mostrarError } from '../../../../../utils/swal.js';


// ---------------- COMPONENTES AUXILIARES ----------------


const Responder = ({ comentarioIndex, publicacionId, setComentariosLocal }) => {
    const [respuesta, setRespuesta] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [mostrarInput, setMostrarInput] = useState(false);
    const inputRef = useRef(null);

    // Cierra el input si se hace click fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (inputRef.current && !inputRef.current.contains(e.target)) {
                setMostrarInput(false);
                setRespuesta('');
            }
        };

        if (mostrarInput) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [mostrarInput]);

    const handleResponder = async () => {
        if (!respuesta.trim()) return;
        setEnviando(true);

        const publicacionRef = doc(db, 'Publicaciones', publicacionId);

        try {
            const publicacionSnap = await getDoc(publicacionRef);
            const data = publicacionSnap.exists() ? publicacionSnap.data() : {};
            const comentariosActuales = Array.isArray(data?.comentarios) ? data.comentarios : [];

            const actualizado = [...comentariosActuales];
            const comentario = actualizado[comentarioIndex];

            if (!comentario) throw new Error("Comentario no encontrado.");

            const respuestasActuales = Array.isArray(comentario.respuestas) ? comentario.respuestas : [];
            const nuevoComentario = {
                ...comentario,
                respuestas: [...respuestasActuales, respuesta]
            };

            actualizado[comentarioIndex] = nuevoComentario;

            await setDoc(publicacionRef, { comentarios: actualizado }, { merge: true });

            setComentariosLocal(actualizado);
            setRespuesta('');
            setMostrarInput(false);
        } catch (e) {
            console.error("Error al responder:", e);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className={styles.responderContainer} ref={inputRef}>
            {!mostrarInput ? (
                <button
                    className={styles.verComentarios}
                    onClick={() => setMostrarInput(true)}
                >
                    Responder
                </button>
            ) : (
                <div
                    className={`${styles.responderAnimado} ${mostrarInput ? styles.activo : ''}`}
                >
                    <input
                        type="text"
                        placeholder="Responder..."
                        value={respuesta}
                        onChange={(e) => setRespuesta(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleResponder()}
                        disabled={enviando}
                        autoFocus
                    />
                    <button className={styles.botonPublicar}
                        onClick={handleResponder}
                        disabled={!respuesta.trim() || enviando}
                    >
                        {enviando ? '...' : 'Enviar'}
                    </button>
                </div>
            )}
        </div>
    );
};



const Encabezado = ({ usuario, eliminarPublicacion, fecha }) => (
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
        {usuario?.role === 'admin' && (
            <button className={styles.botonEliminar} onClick={eliminarPublicacion}>
                Eliminar
            </button>
        )}
    </div>
);

const ImagenPublicacion = ({ src, alt, videoUrl }) => {
    const videoRef = useRef(null);

    const esImagen = (url) =>
        /(\.jpg|\.jpeg|\.png|\.gif|\.bmp|\.webp)(\?.*)?$/i.test(url);

    const esVideo = (url) =>
        /(\.mp4|\.webm|\.ogg)(\?.*)?$/i.test(url);

    const esYouTube = (url) =>
        url?.includes('youtube') || url?.includes('youtu.be');

    const togglePlay = () => {
        const video = videoRef.current;
        if (video?.paused) video.play();
        else video.pause();
    };

    return (
        <div className={styles.contenidoImagen}>
            {src && esImagen(src) && (
                <img src={src} className={styles.imagen} alt={alt} />
            )}

            {videoUrl && esYouTube(videoUrl) && (
                <iframe
                    width="100%"
                    height="250"
                    src={videoUrl.replace("watch?v=", "embed/")}
                    title="Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            )}

            {videoUrl && esVideo(videoUrl) && (
                <video
                    ref={videoRef}
                    className={styles.imagen}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onClick={togglePlay}
                >
                    <source src={videoUrl} />
                    Tu navegador no soporta el video.
                </video>
            )}
        </div>
    );
};


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
    refContenedor,
    publicacionId,
    setComentariosLocal,
    usuario,
    eliminarComentario
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
                                <div className={styles.avatarComentario}>
                                    {comentario.usuarioFotoURL ? (
                                        <img
                                            src={comentario.usuarioFotoURL}
                                            alt="Avatar"
                                            className={styles.avatarComentarioImg}
                                        />
                                    ) : (
                                        <span className={styles.inicialComentario}>
                                            {comentario.usuarioNombre?.[0] || 'U'}
                                        </span>
                                    )}
                                </div>
                                <div className={styles.cuerpoComentario}>
                                    <div className={styles.comentarioHeader}>
                                        <span className={styles.usuarioComentario}>
                                            {comentario.usuarioNombre}
                                        </span>
                                        <span className={styles.fechaComentario}>
                                            {new Date(comentario.fecha).toLocaleDateString('es-AR')}
                                        </span>

                                        {usuario?.role === 'admin' && (
                                            <button
                                                className={styles.eliminarComentario}
                                                onClick={() => eliminarComentario(index)}
                                                title="Eliminar comentario"
                                            >
                                                ✖
                                            </button>
                                        )}
                                    </div>
                                    <p className={styles.textoComentario}>{comentario.texto}</p>

                                    {comentario.respuestas?.map((resp, i) => (
                                        <div key={i} className={styles.comentario}>
                                            <div className={styles.avatarComentario}>
                                                <img
                                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzPs0ng1OihF-_SsKH3o2j2ThKJa21zWYlmg&s"
                                                    alt="Avatar"
                                                    className={styles.avatarComentarioImg}
                                                />
                                            </div>
                                            <div className={styles.cuerpoComentario}>
                                                <div className={styles.comentarioHeader}>
                                                    <span className={styles.usuarioComentario}>Will Power Gym</span>
                                                    <span className={styles.fechaComentario}>
                                                        {new Date().toLocaleDateString('es-AR')}
                                                    </span>
                                                </div>
                                                <p className={styles.textoComentario}>{resp}</p>
                                            </div>
                                        </div>
                                    ))}


                                    {usuario?.role === 'admin' && (
                                        <Responder
                                            comentarioIndex={index}
                                            publicacionId={publicacionId}
                                            setComentariosLocal={setComentariosLocal}
                                        />
                                    )}

                                </div>
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

// ---------------- COMPONENTE PRINCIPAL ----------------

function Publicacion({ publicacion, usuario }) {
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [mostrarComentarios, setMostrarComentarios] = useState(false);
    const [animarComentarios, setAnimarComentarios] = useState(false);
    const [loadingComentario, setLoadingComentario] = useState(false);
    const [comentariosLocal, setComentariosLocal] = useState(publicacion.comentarios || []);



    const eliminarComentario = async (index) => {
        const confirmado = await confirmarEliminacion('¿Eliminar este comentario?', 'Esta acción no se puede deshacer.');
        if (!confirmado) return;

        try {
            const publicacionRef = doc(db, 'Publicaciones', publicacion.id);
            const publicacionSnap = await getDoc(publicacionRef);
            const data = publicacionSnap.data();
            const comentariosActuales = Array.isArray(data?.comentarios) ? data.comentarios : [];

            const comentariosActualizados = comentariosActuales.filter((_, i) => i !== index);

            await setDoc(publicacionRef, { comentarios: comentariosActualizados }, { merge: true });
            await mostrarExito('Comentario eliminado');
            window.location.reload();
        } catch (error) {
            console.error("Error al eliminar comentario:", error);
            mostrarError('Hubo un problema al eliminar el comentario.');
        }
    };






    const eliminarPublicacion = async () => {
        const confirmado = await confirmarEliminacion('¿Eliminar publicación?', 'Esta acción eliminará la publicación por completo.');
        if (!confirmado) return;

        try {
            await deleteDoc(doc(db, 'Publicaciones', publicacion.id));
            await mostrarExito('Publicación eliminada');
            window.location.reload();
        } catch (error) {
            console.error("Error al eliminar publicación:", error);
            mostrarError('Ocurrió un error al eliminar la publicación.');
        }
    };



    const currentUser = auth.currentUser;
    console.log(currentUser)
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
            // Obtener datos del usuario actual
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            const userData = userDocSnap.exists() ? userDocSnap.data() : {};
            const nombreUsuario = userData.nombre || 'Anónimo';

            // Crear comentario nuevo
            const nuevo = {
                texto: nuevoComentario,
                usuarioId: currentUser.uid,
                usuarioNombre: nombreUsuario,
                fecha: new Date().toISOString(),
                respuestas: [] // importante para evitar sobrescribir luego
            };

            // 🔽 Leer comentarios actuales desde Firestore
            const publicacionSnap = await getDoc(publicacionRef);
            const data = publicacionSnap.exists() ? publicacionSnap.data() : {};
            const comentariosActuales = Array.isArray(data?.comentarios) ? data.comentarios : [];


            // 🔽 Agregar el nuevo comentario al array completo
            const comentariosActualizados = [...comentariosActuales, nuevo];

            // 🔽 Guardar los comentarios actualizados
            await setDoc(publicacionRef, {
                comentarios: comentariosActualizados
            }, { merge: true });

            // 🔽 Actualizar localmente
            setComentariosLocal(comentariosActualizados);
            setNuevoComentario('');
        } catch (error) {
            console.error("Error al agregar comentario:", error);
        } finally {
            setLoadingComentario(false);
        }
    };


    return (
        <div className={styles.publicacionContainer}>
            <Encabezado usuario={usuario} eliminarPublicacion={eliminarPublicacion} fecha={publicacion.fecha} />
            <ImagenPublicacion
                src={publicacion.imagen}
                videoUrl={publicacion.video}
                alt={`Publicación de ${publicacion.autor}`}
            />
            <Descripcion texto={publicacion.descripcion} />
            <Comentarios
                comentarios={comentariosLocal}
                mostrar={mostrarComentarios}
                setMostrar={setMostrarComentarios}
                animar={animarComentarios}
                refContenedor={comentariosRef}
                publicacionId={publicacion.id}
                setComentariosLocal={setComentariosLocal}
                usuario={usuario} // 👈 agregado
                eliminarComentario={eliminarComentario}
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

export default Publicacion;;



