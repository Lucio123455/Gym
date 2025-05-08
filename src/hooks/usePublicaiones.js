// 📁 src/hooks/usePublicaciones.js
import { useEffect, useState } from 'react';
import { getPublicaciones } from '../services/publicaciones.js';

export const usePublicaciones = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getPublicaciones();
        setPublicaciones(data);
        setStatus('success');
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };
    fetch();
  }, []);

  return { publicaciones, status };
};
