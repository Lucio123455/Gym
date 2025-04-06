import { useLocation } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  const location = useLocation();
  let title = '';

  switch (location.pathname) {
    case '/':
      title = 'Home';
      break;
    case '/chat':
      title = 'Chat';
      break;
    case '/entrenamiento':
      title = 'Entrenamiento';
      break;
    case '/perfil':
      title = 'Perfil';
      break;
    default:
      title = 'GymApp';
  }

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
    </header>
  );
}