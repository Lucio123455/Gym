import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { getDoc, doc } from 'firebase/firestore';

const UsuarioContext = createContext(null);

export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loadingUsuario, setLoadingUsuario] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setUsuario(userDoc.data());
      } else {
        setUsuario(null);
      }
      setLoadingUsuario(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UsuarioContext.Provider value={{ usuario, loadingUsuario }}>
      {children}
    </UsuarioContext.Provider>
  );
};

export const useUsuario = () => useContext(UsuarioContext);
