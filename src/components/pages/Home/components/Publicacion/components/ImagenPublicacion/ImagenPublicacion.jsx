import React, { useRef, useEffect, useState } from 'react';
import styles from './ImagenPublicacion.module.css';

export default function ImagenPublicacion({ src, alt, videoUrl, mutedGlobal, setMutedGlobal }) {
  const videoRef = useRef(null);
  const clickTimeoutRef = useRef(null);

  const [flashReinicio, setFlashReinicio] = useState(false);
  const [mostrarIcono, setMostrarIcono] = useState(false);
  const [estaVisible, setEstaVisible] = useState(false);

  const esImagen = (url) =>
    /(\.jpg|\.jpeg|\.png|\.gif|\.bmp|\.webp)(\?.*)?$/i.test(url);

  const esVideo = (url) =>
    /(\.mp4|\.webm|\.ogg)(\?.*)?$/i.test(url);

  const esYouTube = (url) =>
    url?.includes('youtube') || url?.includes('youtu.be');

  const toggleMute = () => {
    setMutedGlobal(!mutedGlobal);
    setMostrarIcono(true);
    setTimeout(() => setMostrarIcono(false), 1000);
  };

  const reiniciarVideo = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => { });
      setFlashReinicio(true);
      setTimeout(() => setFlashReinicio(false), 300);
    }
  };

  const handleClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      reiniciarVideo();
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        toggleMute();
        clickTimeoutRef.current = null;
      }, 250);
    }
  };


  // autoplay inicial
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => { });
    }
  }, []);

  // observar visibilidad
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => setEstaVisible(entry.intersectionRatio >= 0.6),
      { threshold: [0.6] } // 🔒 solo si está completamente visible
    );


    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // aplicar mute dinámico
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = mutedGlobal || !estaVisible;
    }
  }, [mutedGlobal, estaVisible]);

  // reproducir/pausar automáticamente según visibilidad
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (estaVisible) {
      video.play().catch(() => { });
    } else {
      video.pause();
    }
  }, [estaVisible]);


  return (
    <div className={styles.contenidoImagen}>
      {src && (
        <img src={src} className={styles.imagen} alt={alt} />
      )}

      {videoUrl && esYouTube(videoUrl) && (
        <iframe
          width="100%"
          height="250"
          src={videoUrl.replace("watch?v=", "embed/")}
          title="Video"
          frameBorder="0"
          allow="autoplay"
          allowFullScreen
        />
      )}

      {videoUrl && esVideo(videoUrl) && (
        <div className={styles.videoWrapper}>
          <video
            ref={videoRef}
            className={`${styles.imagen} ${flashReinicio ? styles.flash : ''}`}
            autoPlay
            loop
            playsInline
            onClick={handleClick}
          >
            <source src={videoUrl} />
          </video>
          {mostrarIcono && (
            <div className={`${styles.iconoVolumen} ${mutedGlobal ? styles.mute : styles.sound}`}>
              {mutedGlobal ? (
                <svg className={styles.iconSvg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.5 12L19 14.5M19 9.5L16.5 12M9 9H5v6h4l5 5V4l-5 5z" />
                </svg>
              ) : (
                <svg className={styles.iconSvg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 9H5v6h4l5 5V4l-5 5zm7.5 3a3.5 3.5 0 00-3.5-3.5v7a3.5 3.5 0 003.5-3.5z" />
                </svg>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


