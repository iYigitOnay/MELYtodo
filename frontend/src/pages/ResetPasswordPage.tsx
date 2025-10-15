import { useState, FormEvent, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "./ResetPasswordPage.module.css";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { resetToken } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!resetToken) {
      setError("Şifre sıfırlama anahtarı eksik.");
    }
  }, [resetToken]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      setIsLoading(false);
      return;
    }

    if (!resetToken) {
      setError("Şifre sıfırlama anahtarı eksik.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/auth/resetpassword/${resetToken}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Şifre sıfırlama başarısız.");
      }

      setMessage(
        data.message ||
          "Şifreniz başarıyla güncellendi. Şimdi giriş yapabilirsiniz."
      );
      setTimeout(() => {
        navigate("/login");
      }, 3000); // 3 saniye sonra
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h1>Yeni Şifre Belirle</h1>
            <p>Lütfen yeni şifrenizi girin.</p>
            {message && <div className={styles.message}>{message}</div>}
            {error && <div className={styles.errorMessage}>{error}</div>}
            <div className={styles.inputGroup}>
              <label htmlFor="password">Yeni Şifre</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Şifreyi Onayla</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className={styles.button}
              disabled={isLoading}
            >
              {isLoading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
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

export default ResetPasswordPage;
