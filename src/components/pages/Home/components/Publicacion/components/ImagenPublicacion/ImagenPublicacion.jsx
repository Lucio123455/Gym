import React, { useRef, useEffect, useState } from 'react';
import styles from './ImagenPublicacion.module.css';

export default function ImagenPublicacion({ src, alt, videoUrl }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [mostrarIcono, setMostrarIcono] = useState(false);

  const esImagen = (url) =>
    /(\.jpg|\.jpeg|\.png|\.gif|\.bmp|\.webp)(\?.*)?$/i.test(url);

  const esVideo = (url) =>
    /(\.mp4|\.webm|\.ogg)(\?.*)?$/i.test(url);

  const esYouTube = (url) =>
    url?.includes('youtube') || url?.includes('youtu.be');

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      const nuevoMuted = !video.muted;
      video.muted = nuevoMuted;
      setMuted(nuevoMuted);
      setMostrarIcono(true);
      setTimeout(() => setMostrarIcono(false), 1000);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  }, []);

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
        <div className={styles.videoWrapper}>
          <video
            ref={videoRef}
            className={styles.imagen}
            autoPlay
            muted
            loop
            playsInline
            onClick={toggleMute}
          >
            <source src={videoUrl} />
            Tu navegador no soporta el video.
          </video>
          {mostrarIcono && (
            <div className={`${styles.iconoVolumen} ${muted ? styles.mute : styles.sound}`}>
              {muted ? '🔇' : '🔊'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


