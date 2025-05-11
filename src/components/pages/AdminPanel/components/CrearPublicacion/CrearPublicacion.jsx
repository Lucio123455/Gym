import React, { useState } from 'react';
import { useAuth } from '../../../../../hooks/useAuth';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../../../firebase/config';
import styles from './CrearPublicacion.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CrearPublicacion() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        descripcion: '',
        mediaUrl: ''
    });


    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const mediaUrl = formData.mediaUrl.trim();
            const isYouTube = mediaUrl.includes('youtube');
            const isVideo = isYouTube || /(\.mp4|\.webm|\.ogg)(\?.*)?$/i.test(mediaUrl);
            const isImage = /(\.jpg|\.jpeg|\.png|\.gif|\.bmp|\.webp)(\?.*)?$/i.test(mediaUrl);


            const nuevaPublicacion = {
                descripcion: formData.descripcion,
                imagen: isImage ? mediaUrl : '',
                video: isVideo ? mediaUrl : '',
                fecha: new Date().toISOString(),
                autor: user.nombre,
                fotoURL: user.fotoURL,
                likes: 0,
                comentarios: []
            };

            await addDoc(collection(db, 'Publicaciones'), nuevaPublicacion);

            toast.success('Publicación creada exitosamente!');
            setFormData({
                descripcion: '',
                mediaUrl: ''
            });
        } catch (err) {
            console.error("Error al crear publicación:", err);
            toast.error('Error al crear la publicación');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className={styles.container}>
            <h2>Agregar Publicación</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        required
                        rows={4}
                        disabled={isSubmitting}
                        placeholder="Escribí un mensaje, contá algo..."
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="mediaUrl">Enlace de imagen o video</label>
                    <input
                        id="mediaUrl"
                        type="url"
                        name="mediaUrl"
                        placeholder="Pegá el enlace de una imagen o video"
                        value={formData.mediaUrl}
                        onChange={handleChange}
                        disabled={isSubmitting}
                    />
                </div>

                {formData.mediaUrl && (
                    <div className={styles.mediaPreview}>
                        {formData.mediaUrl.includes('youtube') ? (
                            <iframe
                                width="100%"
                                height="250"
                                src={formData.mediaUrl.replace("watch?v=", "embed/")}
                                title="Video de la publicación"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : formData.mediaUrl.toLowerCase().endsWith('.mp4') ? (
                            <video width="100%" height="250" controls>
                                <source src={formData.mediaUrl} />
                                Tu navegador no soporta la reproducción de video.
                            </video>
                        ) : (
                            <img
                                src={formData.mediaUrl}
                                alt="Vista previa del contenido"
                                className={styles.imagen}
                            />
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.submitButton}
                >
                    {isSubmitting ? 'Publicando...' : 'Publicar'}
                </button>
            </form>
        </div>
    );
}
