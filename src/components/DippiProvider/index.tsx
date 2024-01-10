import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Dippi } from '@dippixyz/base-sdk';

type User = {
  email: string;
  password: string;
};

interface AuthContextType {
  user: User | null;
  handleSignIn: (userData: User) => void;
  handleSignUp: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface DippiProviderProps {
  children: ReactNode;
  config: {
    appToken: string;
    appId: string;
    url: string;
  };
}

export function DippiProvider({ children, config}: DippiProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const dippiClient = new Dippi({
    appToken: config.appToken,
    appId: config.appId,
    url: config.url,
  });

  
  const handleSignUp = async (userData: User) => {
    const { accessToken } = await dippiClient.auth.login();
    dippiClient.setAuthToken(accessToken);
    
    let user = await dippiClient.user.createProfile({
        email: userData.email,
        password: userData.password,
        applicationId: config.appId,
        authType:"email",
        phone: ""
    });

    console.log('user SignUp>>>>>>>>>>>', user);
  };

  const handleSignIn = async (userData: User) => {
    setUser(userData);

    const { accessToken } = await dippiClient.auth.login();
    dippiClient.setAuthToken(accessToken);

    let user = await dippiClient.user.authenticate({
      email: userData.email,
      password: userData.password,
      token: config.appToken,
      applicationId: config.appId,
      countryCode: ""
    });

    console.log('user SignIn>>>>>>>>>>>', user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, handleSignIn, handleSignUp ,logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useDippiContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useDippiContext debe utilizarse dentro de un DippiProvider');
  }
  return context;
}