import styles from './Publicacion.module.css';

function Publicacion({ publicacion }) {
    return (
        <div className={styles.publicacionContainer}>
            {/* Encabezado */}
            <div className={styles.encabezado}>
                <div className={styles.autorInfo}>
                    <div className={styles.avatar}></div>
                    <span className={styles.nombreAutor}>{publicacion.autor}</span>
                </div>
                <span className={styles.fecha}>{publicacion.fecha}</span>
            </div>

            {/* Imagen */}
            <div className={styles.contenidoImagen}>
                <img
                    src={publicacion.imagen}
                    className={styles.imagen}
                />
            </div>

            {/* Acciones */}
            <div className={styles.acciones}>
                <button className={styles.botonAccion}>❤️</button>
                <button className={styles.botonAccion}>💬</button>
                <button className={styles.botonAccion}>↗️</button>
                <button className={styles.botonGuardar}>🔖</button>
            </div>

            {/* Likes */}
            <div className={styles.likes}>
                <span>{publicacion.likes} me gusta</span>
            </div>

            {/* Descripción */}
            <div className={styles.descripcion}>
                <span className={styles.nombreAutor}>{publicacion.autor}</span>
                <span>{publicacion.descripcion}</span>
            </div>

            {/* Comentarios */}
            <div className={styles.comentarios}>
                <button className={styles.verComentarios}>
                    Ver los {publicacion.comentarios.length} comentarios
                </button>
                {publicacion.comentarios.slice(0, 2).map((comentario, index) => (
                    <div key={index} className={styles.comentario}>
                        <span className={styles.usuarioComentario}>usuario{index + 1}</span>
                        <span>{comentario}</span>
                    </div>
                ))}
            </div>

            {/* Añadir comentario */}
            <div className={styles.agregarComentario}>
                <input type="text" placeholder="Añade un comentario..." />
                <button className={styles.botonPublicar}>Publicar</button>
            </div>
        </div>
    );
}

export default Publicacion;