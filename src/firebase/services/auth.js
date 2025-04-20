import { auth } from '../config';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config';

// Función para registrar usuarios con validaciones
export const register = async (userData) => {
  try {
    // Validaciones básicas
    if (!userData.email || !userData.password || !userData.nombre || !userData.dni) {
      throw new Error('Todos los campos son obligatorios');
    }

    if (userData.email !== userData.confirmEmail) {
      throw new Error('Los emails no coinciden');
    }

    if (userData.password !== userData.confirmPassword) {
      throw new Error('Las contraseñas no coinciden');
    }

    if (userData.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    if (!/^\d{8,10}$/.test(userData.dni)) {
      throw new Error('DNI debe tener entre 8 y 10 dígitos');
    }

    // 1. Crear usuario en Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );

    // 2. Actualizar perfil con nombre
    await updateProfile(userCredential.user, {
      displayName: userData.nombre
    });

    // 3. Guardar datos adicionales en Firestore (rol automático como 'member')
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      nombre: userData.nombre,
      dni: userData.dni,
      email: userData.email,
      role: 'member', // Rol automático
      createdAt: new Date(),
      lastLogin: new Date(),
      estado: 'activo'
    });

    return {
      ...userCredential,
      user: {
        ...userCredential.user,
        nombre: userData.nombre,
        dni: userData.dni,
        role: 'member'
      }
    };
  } catch (error) {
    console.error("Error en registro:", error);
    throw error;
  }
};

// Función para login (mejorada)
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Actualizar última conexión
    await updateDoc(doc(db, 'users', userCredential.user.uid), {
      lastLogin: new Date()
    });

    // Obtener datos adicionales del usuario
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    return {
      ...userCredential,
      user: {
        ...userCredential.user,
        ...userDoc.data()
      }
    };
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
};

// Función para logout (sin cambios)
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error en logout:", error);
    throw error;
  }
};

// Observador de estado de autenticación (mejorado)
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Obtener datos adicionales de Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      // Crear objeto de usuario unificado
      const completeUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        ...userDoc.data()
      };
      
      callback(completeUser);
    } else {
      callback(null);
    }
  });
};

// Función adicional: Obtener usuario actual con datos completos
export const getCurrentUser = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const userDoc = await getDoc(doc(db, 'users', user.uid));
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    ...userDoc.data()
  };
};