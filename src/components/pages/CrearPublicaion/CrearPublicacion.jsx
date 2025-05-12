import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import styles from './CrearPublicacion.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CrearPublicacion() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        descripcion: '',
        mediaUrl: ''
    });

    const galeriaSimulada = [
        'https://picsum.photos/id/1015/400/400',
        'https://picsum.photos/id/1065/400/400',
        'https://picsum.photos/id/1035/400/400',
        'https://picsum.photos/id/1040/400/400',
        'https://picsum.photos/id/1050/400/400',
        'https://picsum.photos/id/1065/400/400',
    ];

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
    {formData.mediaUrl && (
      <div className={styles.mediaPreview}>
        <img src={formData.mediaUrl} alt="Preview seleccionada" />
      </div>
    )}

    <div className={styles.galeriaSimulada}>
      {galeriaSimulada.map((url, i) => (
        <img
          key={i}
          src={url}
          alt={`img-${i}`}
          onClick={() => setFormData({ ...formData, mediaUrl: url })}
          className={`${styles.thumb} ${formData.mediaUrl === url ? styles.selected : ''}`}
        />
      ))}
    </div>

    {formData.mediaUrl && (
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            rows={3}
            disabled={isSubmitting}
            placeholder="¿Qué estás pensando?"
            className={styles.textarea}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? 'Publicando...' : 'Continuar'}
        </button>
      </form>
    )}
  </div>
);



}
