import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Header.module.css';
import logo from '../assets/melygranmom.png'; // Logoyu import et

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.titleLink}>
        <img src={logo} alt="Mely Grandmom's stories" className={styles.logo} />
        <h1 className={styles.title}>Mely Grandmom's Stories</h1>
      </Link>
      <nav className={styles.nav}>
        {user ? (
          <>
            <span className={styles.userInfo}>Hoş geldin, <span className={styles.userName}>{user.name}</span></span>
            <button onClick={logout} className={styles.logoutButton}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Giriş Yap</Link>
            <Link to="/register">Kayıt Ol</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
