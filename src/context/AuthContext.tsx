import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { db } from '../database/db';
import { INITIAL_USERS } from '../database/seedData';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole | null;
  loginAs: (role: UserRole) => Promise<void>;
  loginWithUsername: (username: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  allUsers: User[];
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'jalin_current_user_id';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await db.populateInitialData();
        const usersFromDb = await db.users.toArray();
        if (usersFromDb.length > 0) {
          setAllUsers(usersFromDb);
        }
        
        // Check saved session in localStorage
        const savedUserId = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedUserId) {
          const found = (usersFromDb.length > 0 ? usersFromDb : INITIAL_USERS).find(u => u.id === savedUserId);
          if (found) {
            setCurrentUser(found);
          } else {
            setCurrentUser(null);
          }
        } else {
          // No auto-login: user must start from LoginPage
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Error loading users:', err);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const loginAs = async (role: UserRole) => {
    const targetUser = allUsers.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      localStorage.setItem(AUTH_STORAGE_KEY, targetUser.id);
    }
  };

  const loginWithUsername = async (
    username: string, 
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanUsername = username.trim().toLowerCase();
    const targetUser = allUsers.find(u => u.username.toLowerCase() === cleanUsername);

    if (!targetUser) {
      return { 
        success: false, 
        error: `Nama pengguna "${username}" tidak terdaftar dalam basis data simulasi.` 
      };
    }

    // Password validation: demo accounts accept 'demo123' or '<username>123'
    if (password !== undefined) {
      const validPasswords = ['demo123', `${cleanUsername}123`, 'admin123', 'jalin2026'];
      if (!validPasswords.includes(password.trim())) {
        return {
          success: false,
          error: 'Kata sandi tidak sesuai. Gunakan kata sandi demo: "demo123".'
        };
      }
    }

    setCurrentUser(targetUser);
    localStorage.setItem(AUTH_STORAGE_KEY, targetUser.id);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser ? currentUser.role : null,
        loginAs,
        loginWithUsername,
        logout,
        allUsers,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

