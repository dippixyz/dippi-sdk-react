import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Dippi } from '@dippixyz/base-sdk';
import { User, DippiProviderProps } from '../../interfaces/authContext';

interface AuthContextType {
    user: User | null;
    signUpStatus: string;
    handleSignIn: (userData: User) => void;
    handleSignUp: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function DippiProvider({ children, config }: DippiProviderProps) {

    const [user, setUser] = useState<User | null>(null);
    // Basar el proceso de autenticacion del usuario con una variable de estado
    // signUpStatus == 'initial' : Significa que el usuario no ha iniciado el proceso de autenticacion
    // signUpStatus == 'waitingEmailVerification : Significa que se esta esperando la verificacion del correo electronico del usuario
    // signUpStatus == 'verified' : Significa que el usuario ya verifico su correo electronico
    // signUpStatus == 'waitingEncryptKeyCode' : Significa que esta esperando que el usuario ingrese su clave de encriptacion
    // signUpStatus == 'completed' : Significa que el usuario ya completo el proceso de autenticacion
    const [signUpStatus, setSignUpStatus] = useState('initial');

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
            authType: "email",
            phone: ""
        });

        if(user.isVerified === false) {
            setSignUpStatus('waitingEmailVerification');
            setUser(user);
            confirmEmailVerification(user.id);
            console.log('signUpStatus >>>>>>>>>>>', signUpStatus, 'waitingEmailVerification');
        };

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

    // crear una funcion que reciba el id del usuario y quede preguntando cada 5 segundos si el usuario ya verifico su correo electronico
    // utilizando el metodo dippiClient.user.getProfile(id) y el atributo isVerified del objeto que retorna
    // si el usuario ya verifico su correo electronico, entonces setSignUpStatus('verified')

    async function confirmEmailVerification(id: string) {
        const { accessToken } = await dippiClient.auth.login();
        dippiClient.setAuthToken(accessToken);

        let user = await dippiClient.user.getProfile(id);
        console.log('get user profile >>>>>>>>>>>', user);

        if(user.isVerified === true) {
            setSignUpStatus('verified');
            setUser(user);
            console.log('signUpStatus >>>>>>>>>>>', signUpStatus, 'verified');
            // esperar 5 segundos y luego cambiar a estado waitingEncryptKeyCode
            setTimeout(() => {
                setSignUpStatus('waitingEncryptKeyCode');
                console.log('signUpStatus >>>>>>>>>>>', signUpStatus, 'waitingEncryptKeyCode');
            }, 3000);
        } else {
            setTimeout(() => {
                confirmEmailVerification(id);
            }, 5000);
        };
    }


    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                signUpStatus,
                handleSignIn, 
                handleSignUp, 
                logout 
            }}>
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
