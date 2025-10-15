import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import styles from './ForgotPasswordPage.module.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`/api/auth/forgotpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'İstek başarısız.');
      }

      setMessage(data.message);

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
            <h1>Şifreni Sıfırla</h1>
            <p>Kayıtlı email adresini gir, sana şifreni sıfırlaman için bir link göndereceğiz.</p>
            {message && <p className={styles.message}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
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
            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? 'Gönderiliyor...' : 'Sıfırlama Linki Gönder'}
            </button>
            <p className={styles.redirectLink}>
              Giriş ekranına geri dönmek için <Link to="/login">tıkla</Link>.
            </p>
          </form>
        </div>
        <div className={styles.imageContainer}></div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
