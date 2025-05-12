import React from 'react';
import { useEffect, useState } from 'react';
import styles from '../Comentarios.module.css';
import { obtenerFotoDeUsuario } from '../../../../../../../../services/publicaciones.js';
import { formatearFecha } from '../../../../../../../../utils/fecha';
import Responder from '../Responder/Responder';
import Respuesta from './Respuesta/Respuesta.jsx';

export default function Comentario({
    comentario,
    respuestas = [],
    publicacionId,
    usuario,
    onEliminar,
    setComentariosLocal,
    setRespuestasPorComentario,
    children
}) {
    const [fotoURL, setFotoURL] = useState(null);
    const [comentarioEliminando, setComentarioEliminando] = React.useState(null);

    useEffect(() => {
        const fetchFoto = async () => {
            const url = await obtenerFotoDeUsuario(comentario.usuarioId);
            setFotoURL(url);
        };
        if (comentario.usuarioId) fetchFoto();
    }, [comentario.usuarioId]);

    return (
        <div className={`${styles.comentario} ${comentarioEliminando ? styles.oculto : ''}`}>
            <div className={styles.avatarComentario}>
                {fotoURL ? (
                    <img
                        src={fotoURL}
                        alt={`Avatar de ${comentario.usuarioNombre}`}
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
                    <span className={styles.usuarioComentario}>{comentario.usuarioNombre}</span>
                    <span className={styles.fechaComentario}>
                        {formatearFecha(comentario.fecha)}
                    </span>

                    {usuario?.role === 'admin' && (
                        <button
                            className={styles.eliminarComentario}
                            onClick={() => {
                                setComentarioEliminando(true);
                                setTimeout(() => {
                                    onEliminar(comentario.id);
                                }, 300); // coincide con el tiempo del CSS
                            }}
                            title="Eliminar comentario"
                        >
                            ✖
                        </button>
                    )}

                </div>

                <p className={styles.textoComentario}>{comentario.texto}</p>
                {respuestas.map((resp) => (
                    <Respuesta key={resp.id} respuesta={resp} />
                ))}

                {usuario?.role === 'admin' && (
                    <Responder
                        comentarioId={comentario.id}
                        publicacionId={publicacionId}
                        setRespuestasPorComentario={setRespuestasPorComentario}
                        usuario={usuario}
                    />
                )}

                {children}
            </div>


        </div >
    );
}
