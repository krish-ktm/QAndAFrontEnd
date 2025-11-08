import { createContext, useContext, useState, ReactNode } from 'react';
import { User, mockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if credentials match any mock user
    const foundUser = mockUsers.find(
      user => user.email.toLowerCase() === email.toLowerCase() && user.password === password
    );

    if (foundUser) {
      // Create a clean user object without the password
      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', 'mock-jwt-token');
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email && password && name) {
      // Check if email already exists
      const existingUser = mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        throw new Error('Email already in use');
      }
      
      // Create a new user (in a real app, this would be saved to a database)
      const newUser: User = {
        id: `${mockUsers.length + 1}`,
        email,
        name
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('authToken', 'mock-jwt-token');
    } else {
      throw new Error('Invalid registration data');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
