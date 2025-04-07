import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { register, login } from '../../firebase/services/auth';
import styles from './AuthGate.module.css';

export default function AuthGate() {
  const { user } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLoginView) {
        await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Las contraseñas no coinciden');
        }
        if (formData.email !== formData.confirmEmail) {
          throw new Error('Los emails no coinciden');
        }
        
        await register({
          nombre: formData.nombre,
          dni: formData.dni,
          email: formData.email,
          confirmEmail: formData.confirmEmail,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (user) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.authContainer}>
        <div className={styles.logoContainer}>
          <svg className={styles.logo} viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-14C6.48 3 2 7.48 2 13s4.48 10 10 10 10-4.48 10-10S17.52 3 12 3z"/>
          </svg>
          <h2 className={styles.title}>{isLoginView ? 'Iniciar Sesión' : 'Registro'}</h2>
        </div>
        
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLoginView && (
            <>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder=" "
                  required
                  className={styles.input}
                />
                <label className={styles.label}>Nombre completo</label>
              </div>
              
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  placeholder=" "
                  pattern="\d{8,10}"
                  required
                  className={styles.input}
                />
                <label className={styles.label}>DNI</label>
              </div>
            </>
          )}

          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              required
              className={styles.input}
            />
            <label className={styles.label}>Correo electrónico</label>
          </div>

          {!isLoginView && (
            <div className={styles.inputGroup}>
              <input
                type="email"
                name="confirmEmail"
                value={formData.confirmEmail}
                onChange={handleChange}
                placeholder=" "
                required
                className={styles.input}
              />
              <label className={styles.label}>Confirmar correo</label>
            </div>
          )}

          <div className={styles.inputGroup}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              required
              minLength="6"
              className={styles.input}
            />
            <label className={styles.label}>Contraseña</label>
          </div>

          {!isLoginView && (
            <div className={styles.inputGroup}>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder=" "
                required
                minLength="6"
                className={styles.input}
              />
              <label className={styles.label}>Confirmar contraseña</label>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? (
              <span className={styles.spinner}></span>
            ) : isLoginView ? (
              'Ingresar'
            ) : (
              'Registrarse'
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.toggleText}>
            {isLoginView ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button 
              type="button"
              onClick={() => {
                setIsLoginView(!isLoginView);
                setError('');
              }}
              className={styles.toggleButton}
            >
              {isLoginView ? ' Regístrate' : ' Inicia sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}