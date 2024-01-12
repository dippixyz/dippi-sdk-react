import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Dippi } from '@dippixyz/base-sdk';
import { DippiProviderProps , User} from '../../interfaces/authContext';
import { UserDippiResponseBody } from '../../interfaces/users.interface';
import { ParamsCreateWallet, Wallet } from '../../interfaces/wallet.interface';
import { addObjectToDB } from '../../utils/functions/indexDB';

interface AuthContextType {
    user: UserDippiResponseBody | null;
    error: string;
    signUpStatus: string;
    address : string;
    isConnected: boolean;
    handleSignIn: (userData: User) => void;
    handleSignUp: (userData: User) => void;
    createWallet: (params: ParamsCreateWallet) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function DippiProvider({ children, config }: DippiProviderProps) {

    const [error , setError] = useState<string>('');
    const [user, setUser] = useState<UserDippiResponseBody | null>(null);
    const [address, setAddress] = useState<string>('');
    const [isConnected, setIsConnected] = useState<boolean>(false);
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

        const user = await dippiClient.user.createProfile({
            email: userData.email,
            password: userData.password,
            applicationId: config.appId,
            authType: "email",
            phone: ""
        });

        // si da error al crear el usuario, entonces mostrar el error en pantalla
        // createProfile(data: UserCreatePayload): Promise<UserResponseBody>; hay que agregar los errores en los tipos del SDK base

        if (!user.id) {
            console.log('error al crear el usuario >>>>>>>>>>>', user);
            setError('Error to create user');
            return;
        }

        if(user.isVerified === false) {
            setSignUpStatus('waitingEmailVerification');
            setUser(user as UserDippiResponseBody | null);
            confirmEmailVerification(user.id);
            console.log('signUpStatus >>>>>>>>>>>', signUpStatus, 'waitingEmailVerification');
        };

        console.log('user SignUp>>>>>>>>>>>', user);
    };

    const handleSignIn = async (userData: User) => {

        const { accessToken } = await dippiClient.auth.login();
        dippiClient.setAuthToken(accessToken);

        const user = await dippiClient.user.authenticate({
            email: userData.email,
            password: userData.password,
            token: config.appToken,
            applicationId: config.appId,
            countryCode: ""
        });

        // La respuesta de authenticate esta mal tipado en el SDK base
        setIsConnected(true);
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

    async function createWallet( params: ParamsCreateWallet ) {

        const { accessToken } = await dippiClient.auth.login();
        dippiClient.setAuthToken(accessToken);
        if (!user) return;

        console.log('create Wallet ..... >>>>>>>>>>>>>', user)
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

        console.log('wallet >>>>>>>>>>>', wallet);
        /// TODO : Hay que agregar en los tipos del SDK base el atributo privateKey a la interface WalletResponseBody
        if (wallet && 'privateKey' in wallet && typeof wallet.privateKey === 'string') {
            console.log('saving private key in indexedDB >>>>>>>>>>>', wallet.privateKey);
            setAddress(wallet.address);
            setIsConnected(true);
            const response = await addObjectToDB({
                id: wallet.ownerId,
                value: wallet.privateKey,
            });
            setSignUpStatus('completed');
            console.log('saved private key in indexedDB >>>>>>>>>>>', response);
        }
    }


    const logout = () => {
        setUser(null);
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
                createWallet,
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
