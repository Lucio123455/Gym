import React, { useRef } from 'react';
import styles from './ImagenPublicacion.module.css';

export default function ImagenPublicacion({ src, alt, videoUrl }) {
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
}
