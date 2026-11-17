import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { db } from '../database/db';
import { INITIAL_USERS } from '../database/seedData';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole | null;
  loginAs: (role: UserRole) => Promise<void>;
  loginWithUsername: (username: string) => Promise<boolean>;
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
        
        const savedUserId = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedUserId) {
          const found = usersFromDb.find(u => u.id === savedUserId);
          if (found) {
            setCurrentUser(found);
          } else {
            // Default to Guru if none found
            setCurrentUser(usersFromDb.find(u => u.role === 'guru') || usersFromDb[0]);
          }
        } else {
          // Default to Guru for initial demonstration
          const defaultUser = usersFromDb.find(u => u.role === 'guru') || usersFromDb[0];
          setCurrentUser(defaultUser);
          if (defaultUser) {
            localStorage.setItem(AUTH_STORAGE_KEY, defaultUser.id);
          }
        }
      } catch (err) {
        console.error('Error loading users:', err);
        setCurrentUser(INITIAL_USERS[4]); // Fallback Siti Rahmawati (Guru)
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

  const loginWithUsername = async (username: string): Promise<boolean> => {
    const targetUser = allUsers.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (targetUser) {
      setCurrentUser(targetUser);
      localStorage.setItem(AUTH_STORAGE_KEY, targetUser.id);
      return true;
    }
    return false;
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

