import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import homeIcon from '../../assets/Home-Link.png';
import entrenamientoIcon from '../../assets/Entrenamiento-Link.png';
import chatIcon from '../../assets/Chat-Link.png';
import perfilIcon from '../../assets/Perfil-Link.png';
import homeIconColor from '../../assets/Home-Link-color.png';
import entrenamientoIconColor from '../../assets/Entrenamiento-Link-color.png';   
import chatIconColor from '../../assets/Chat-Link-color.png';
import perfilIconColor from '../../assets/Perfil-Link-color.png';

export default function Navbar() {
  const location = useLocation();
  const navItems = [
    { path: "/", icon: homeIcon, iconActive: homeIconColor, label: "Home" },
    { path: "/chat", icon: chatIcon, iconActive: chatIconColor, label: "Chat" },
    { path: "/entrenamiento", icon: entrenamientoIcon, iconActive: entrenamientoIconColor, label: "Entrenamiento" },
    { path: "/perfil", icon: perfilIcon, iconActive: perfilIconColor, label: "Perfil" }
  ];

  return (
    <nav className={styles.navbar}>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`${styles.navItem} ${
            location.pathname === item.path ? styles.active : ''
          }`}
        >
          <div className={styles.iconContainer}>
            <img
              src={location.pathname === item.path ? item.iconActive : item.icon}
              alt={item.label}
              className={styles.navIcon}
            />
            {location.pathname === item.path && (
              <div className={styles.activeIndicator} />
            )}
          </div>
        </Link>
      ))}
    </nav>
  );
}