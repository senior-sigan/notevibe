import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getToken, removeToken, isTokenValid } from '../api/auth';
import type { User } from '../api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Проверяем токен при инициализации
  useEffect(() => {
    const initializeAuth = () => {
      const token = getToken();
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser && isTokenValid(token)) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch {
          // Если данные пользователя повреждены, очищаем все
          removeToken();
          localStorage.removeItem('user');
        }
      } else {
        // Если токен недействителен, очищаем все
        removeToken();
        localStorage.removeItem('user');
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setIsLoginModalOpen(false); // Закрываем модальное окно после успешного входа
  };

  const logout = () => {
    setUser(null);
    removeToken();
    localStorage.removeItem('user');
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
