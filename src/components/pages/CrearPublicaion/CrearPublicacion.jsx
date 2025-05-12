import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // si no lo tenés aún
import { useAuth } from '../../../hooks/useAuth';
import styles from './CrearPublicacion.module.css';
import { crearPublicacion } from '../../../services/publicaciones';
import { showToastSuccess, showToastError } from '../../../utils/AlertService';

export default function CrearPublicacion() {
  const galeriaSimulada = [
    { type: 'image', url: 'https://picsum.photos/id/10/400/400' },
    { type: 'image', url: 'https://picsum.photos/id/11/400/400' },
    { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { type: 'image', url: 'https://picsum.photos/id/14/400/400' },
    { type: 'video', url: 'https://www.w3schools.com/html/movie.mp4' },
    { type: 'image', url: 'https://picsum.photos/id/17/400/400' },
    { type: 'image', url: 'https://picsum.photos/id/20/400/400' },
    { type: 'video', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' },
    { type: 'image', url: 'https://picsum.photos/id/21/400/400' },
    { type: 'image', url: 'https://picsum.photos/id/22/400/400' },
    { type: 'video', url: 'https://media.w3.org/2010/05/sintel/trailer.mp4' },
    { type: 'image', url: 'https://picsum.photos/id/23/400/400' },
    { type: 'image', url: 'https://picsum.photos/id/24/400/400' },
    { type: 'image', url: 'https://picsum.photos/id/25/400/400' },
    { type: 'image', url: 'https://picsum.photos/id/26/400/400' },
    { type: 'image', url: 'https://picsum.photos/id/27/400/400' },
    { type: 'image', url: 'https://picsum.photos/id/28/400/400' },
    { type: 'image', url: 'https://picsum.photos/id/29/400/400' },
    { type: 'image', url: 'https://picsum.photos/id/30/400/400' },
    { type: 'image', url: 'https://picsum.photos/id/31/400/400' },
    { type: 'image', url: 'https://picsum.photos/id/32/400/400' },
    { type: 'image', url: 'https://picsum.photos/id/33/400/400' },
    { type: 'image', url: 'https://picsum.photos/id/34/400/400' },
    { type: 'image', url: 'https://picsum.photos/id/35/400/400' }
  ];
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [formData, setFormData] = useState({
    descripcion: '',
    mediaUrl: galeriaSimulada[0].url,
    mediaType: galeriaSimulada[0].type
  });

  const nuevaPublicacionHandler = async () => {
    if (!formData.mediaUrl || !formData.descripcion.trim()) {
      toast.error("Completá la descripción y seleccioná una imagen o video.");
      return;
    }

    const res = await crearPublicacion({
      descripcion: formData.descripcion,
      mediaUrl: formData.mediaUrl,
      mediaType: formData.mediaType,
      usuario: user
    });

    if (res.success) {
      showToastSuccess("Publicación creada con éxito");
      navigate('/');
    } else {
      showToastError("Error al crear la publicación");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Nueva publicación</span>
        <button
          className={styles.headerButton}
          onClick={() => setStep(2)}
        >
          Siguiente
        </button>
      </div>



      {step === 1 && (
        <>
          {formData.mediaUrl && (
            <div className={styles.mediaPreview}>
              {formData.mediaType === 'video' ? (
                <video width="100%" height="100%" controls>
                  <source src={formData.mediaUrl} />
                  Tu navegador no soporta el video.
                </video>
              ) : (
                <img src={formData.mediaUrl} alt="Preview seleccionada" />
              )}
            </div>
          )}

          <div className={styles.galeriaSimulada}>
            {galeriaSimulada.map((item, i) => (
              <div
                key={i}
                className={`${styles.thumbWrapper} ${formData.mediaUrl === item.url ? styles.selected : ''}`}
                onClick={() =>
                  setFormData({ ...formData, mediaUrl: item.url, mediaType: item.type })
                }
              >
                {item.type === 'video' ? (
                  <>
                    <video className={styles.thumbVideo} muted>
                      <source src={item.url} />
                    </video>
                    <div className={styles.playOverlay}>▶</div>
                  </>
                ) : (
                  <img src={item.url} alt={`img-${i}`} className={styles.thumb} />
                )}
              </div>
            ))}
          </div>
        </>
      )}
      {step === 2 && (
        <div className={styles.publicarContainer}>
          <div className={styles.mediaFinalPreview}>
            {formData.mediaType === 'video' ? (
              <video width="100%" height="100%" controls>
                <source src={formData.mediaUrl} />
                Tu navegador no soporta el video.
              </video>
            ) : (
              <img src={formData.mediaUrl} alt="Preview final" />
            )}
          </div>

          <textarea
            placeholder="Escribí una descripción..."
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            className={styles.descripcionTextarea}
            rows={3}
          />

          <button
            className={styles.publicarButton}
            onClick={nuevaPublicacionHandler}
          >
            Publicar
          </button>
        </div>
      )}


    </div>
  );
}

