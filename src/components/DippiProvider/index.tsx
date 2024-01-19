import React, { createContext, useContext, useState, useEffect } from 'react';
import { Dippi } from '@dippixyz/base';
import { DippiProviderProps , User} from '../../interfaces/authContext';
import { UserDippiResponseBody } from '../../interfaces/users.interface';
import { ParamsCreateWallet } from '../../interfaces/wallet.interface';
import { addObjectToDB } from '../../utils/functions/indexDB';

interface ChangePasswordPayload {
    userEmail: string;
    oldPassword: string;
    password: string;
    repeatedPassword: string;
}

interface AuthContextType {
    user: UserDippiResponseBody | null;
    error: string;
    signUpStatus: string;
    address : string;
    isConnected: boolean;
    handleSignIn: (userData: User) => void;
    handleSignUp: (userData: User) => void;
    createWallet: (params: ParamsCreateWallet) => void;
    handlePasswordChange: (changePasswordData: ChangePasswordPayload) => void;
    disconnect: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function DippiProvider({ children, config }: DippiProviderProps) {

    const [error , setError] = useState<string>('');
    const [user, setUser] = useState<UserDippiResponseBody | null>(null);
    const [address, setAddress] = useState<string>('');
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [signUpStatus, setSignUpStatus] = useState('initial');

    // Create two useEffects, one by when the component is mounted and another by when the variable user, addreess, signUpStatus or isConnected changes

    useEffect(() => {
        const storedUserData = localStorage.getItem('dippiUserData');
        if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            setUser(userData.user);
            setError(userData.error);
            setSignUpStatus(userData.signUpStatus);
            setAddress(userData.address);
            setIsConnected(userData.isConnected);
        }
    }, []);
    
    useEffect(() => {
        localStorage.setItem('dippiUserData', JSON.stringify({ 
            user, 
            error, 
            signUpStatus, 
            address, 
            isConnected 
        }));
    }, [user, error, signUpStatus, address, isConnected]);
    
    const dippiClient = new Dippi({
        appToken: config.appToken,
        appId: config.appId,
        url: config.url,
    });

    const handleSignUp = async (userData: User) => {
        const { accessToken } = await dippiClient.auth.login();
        dippiClient.setAuthToken(accessToken);

        const response = await dippiClient.user.createProfile({
            email: userData.email,
            password: userData.password,
            applicationId: config.appId,
            authType: "email",
            phone: ""
        });

        if ('error' in response) {
            setError(response.message);
            return;
        }

        const user = response as UserDippiResponseBody;

        if(user.isVerified === false) {
            setSignUpStatus('waitingEmailVerification');
            setUser(user);
            confirmEmailVerification(user.id);
        };
    };

    const handleSignIn = async (userData: User) => {

        const { accessToken } = await dippiClient.auth.login();
        dippiClient.setAuthToken(accessToken);
        setError('');

        const response = await dippiClient.user.authenticate({
            email: userData.email,
            password: userData.password,
            token: config.appToken,
            applicationId: config.appId,
            countryCode: ""
        });

        // La respuesta de authenticate esta mal tipado en el SDK base
        if ('error' in response) {
            setError(response.message);
            return;
        }

        const user = response.user as UserDippiResponseBody;
        setIsConnected(true);
        setUser(user as UserDippiResponseBody | null);
        setSignUpStatus('completed');
        setAddress(response.walletAddress)        
    };

    async function confirmEmailVerification(id: string) {
        const { accessToken } = await dippiClient.auth.login();
        dippiClient.setAuthToken(accessToken);

        const response = await dippiClient.user.getProfile(id);
        if ('error' in response) {
            setError(response.message);
            return;
        }
        const user = response as UserDippiResponseBody;

        if(user.isVerified === true) {
            setSignUpStatus('verified');
            setUser(user);
            setTimeout(() => {
                setSignUpStatus('waitingEncryptKeyCode');
            }, 3000);
        } else {
            setTimeout(() => {
                confirmEmailVerification(id);
            }, 5000);
        };
    }

    async function createWallet( params: ParamsCreateWallet ) {

        const { accessToken } = await dippiClient.auth.login();
        dippiClient.setAuthToken(accessToken);
        if (!user) return;

        const wallet = await dippiClient.wallet.create({
            ownerId: user.id,
            walletType: "Polygon",
            isTestNet: false,
            storeOption: "local",
            userCode: params.userCode,
            name: "My Wallet",
            fromMnemonic: false,
            mnemonicPhrase: "",
            fromPrivateKey: false,
            privateKey: "",
            useRecoveryPhrase: false,
            recoveryPhrase: "",
            repeatedRecoveryPhrase: "",
            useKeyppiProtocol: false,
            useKeyppiTransactionInfluenciableWallets: false,
            transactionInfluenciableWallets: "",
            acceptTermsAndConditions: true,
            environment: params.environment,
        });

        if (!wallet.id){
            setError('Error creating wallet');
            return;
        } else {

            setAddress(wallet.address);
            setIsConnected(true);
            await addObjectToDB({
                id: wallet.ownerId,
                value: wallet.privateKey,
            });
            setSignUpStatus('completed');
        }
    }


    const handlePasswordChange = async (changePasswordData: ChangePasswordPayload) => {
        
        const { accessToken } = await dippiClient.auth.login();
        dippiClient.setAuthToken(accessToken);

        const response = await dippiClient.user.changePassword({
            userEmail: changePasswordData.userEmail,
            oldPassword: changePasswordData.oldPassword,
            password: changePasswordData.password,
            repeatedPassword: changePasswordData.repeatedPassword
        });
    };

    const disconnect = () => {
        setUser(null);
        setAddress('');
        setIsConnected(false);
        setSignUpStatus('initial');
        setError('');
        localStorage.removeItem('dippiUserData');
    };

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                signUpStatus,
                error,
                address,
                isConnected,
                handleSignIn, 
                handleSignUp, 
                handlePasswordChange,
                createWallet,
                disconnect 
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

// Basar el proceso de autenticacion del usuario con una variable de estado
// signUpStatus == 'initial' : Significa que el usuario no ha iniciado el proceso de autenticacion
// signUpStatus == 'waitingEmailVerification : Significa que se esta esperando la verificacion del correo electronico del usuario
// signUpStatus == 'verified' : Significa que el usuario ya verifico su correo electronico
// signUpStatus == 'waitingEncryptKeyCode' : Significa que esta esperando que el usuario ingrese su clave de encriptacion
// signUpStatus == 'completed' : Significa que el usuario ya completo el proceso de autenticacion