import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // AuthContext'i kullanmak için
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // Context'ten login fonksiyonunu alıyoruz

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Giriş başarısız.');
      }

      // Giriş başarılı, context'teki login fonksiyonunu çağır
      login(data);

      // Kullanıcıyı ana sayfaya yönlendir
      navigate('/');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h1>Mely'ye Hoş Geldin!</h1>
            <p>Hikayelerine kaldığın yerden devam et.</p>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Şifre</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Link to="/forgot-password" className={styles.forgotLink}>Şifremi Unuttum?</Link>
            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
            <p className={styles.redirectLink}>
              Hesabın yok mu? <Link to="/register">Hemen Kaydol</Link>
            </p>
          </form>
        </div>
        <div className={styles.imageContainer}></div>
      </div>
    </div>
  );
};

export default LoginPage;