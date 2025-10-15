import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Kayıt başarısız.');
      }

      // Kayıt başarılı, kullanıcıyı giriş sayfasına yönlendir
      navigate('/login');

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
            <h1>Mely'ye Kaydol</h1>
            <p>Harika hikayeler oluşturmaya başla!</p>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <div className={styles.inputGroup}>
              <label htmlFor="name">İsim</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
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
            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? 'Kaydediliyor...' : 'Kayıt Ol'}
            </button>
            <p className={styles.redirectLink}>
              Zaten bir hesabın var mı? <Link to="/login">Giriş Yap</Link>
            </p>
          </form>
        </div>
        <div className={styles.imageContainer}></div>
      </div>
    </div>
  );
};

export default RegisterPage;