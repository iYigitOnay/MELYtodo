import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Kullanıcı nesnesinin ve Context'in nasıl görüneceğini tanımlıyoruz
interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Context'i oluşturuyoruz
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Diğer bileşenleri sarmalayacak olan Ana Sağlayıcı (Provider) bileşeni
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  // Uygulama ilk yüklendiğinde tarayıcı hafızasını kontrol et
  useEffect(() => {
    const storedUser = localStorage.getItem('melyUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Giriş yapma fonksiyonu
  const login = (userData: User) => {
    localStorage.setItem('melyUser', JSON.stringify(userData));
    setUser(userData);
  };

  // Çıkış yapma fonksiyonu
  const logout = () => {
    localStorage.removeItem('melyUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Bu context'i kolayca kullanmak için özel bir hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth, bir AuthProvider içinde kullanılmalıdır');
  }
  return context;
};
