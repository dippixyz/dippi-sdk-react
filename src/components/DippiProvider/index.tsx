import React, { createContext, useContext, useState, useEffect } from 'react';
import { Dippi } from '@dippixyz/base';
import { DippiProviderProps , User, SignInConnectWalletPayloadType, TokenPair} from '../../interfaces/authContext';
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
    isResetPassword: boolean;
    isChangedPassword: boolean;
    waitingResponse: boolean;
    handleConnectWallet: (
        data: SignInConnectWalletPayloadType,
    ) => Promise<TokenPair>;
    setTokenPair: (tokenPair: TokenPair | null) => void;
    handleSignIn: (userData: User) => void;
    handleSignUp: (userData: User) => void;
    createWallet: (params: ParamsCreateWallet) => void;
    handlePasswordChange: (changePasswordData: ChangePasswordPayload) => void;
    handlePasswordReset: (email: string) => void;
    disconnect: () => void;
}

const ACCESS_TOKEN_KEY = 'dippi-access-token';
const REFRESH_TOKEN_KEY = 'dippi-refresh-token';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function DippiProvider({ children, config }: DippiProviderProps) {

    const [error, setError] = useState<any>();
    const [user, setUser] = useState<UserDippiResponseBody | null>(null);
    const [address, setAddress] = useState<string>('');
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isResetPassword, setIsResetPassword] = useState<boolean>(false);
    const [isChangedPassword, setIsChangedPassword] = useState<boolean>(false);
    const [signUpStatus, setSignUpStatus] = useState('initial');
    const [waitingResponse, setWaitingResponse] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
    const [tokenPair, setTokenPair] = useState<TokenPair | null>();

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

    useEffect(() => {
        if (error || isResetPassword) {
            setTimeout(() => {
                setError('');
                setIsResetPassword(false);
            }, 5000);
        }
    }, [error, isResetPassword]);
    
    const dippiClient = new Dippi({
        appToken: config.appToken,
        appId: config.appId,
        url: config.url,
    });

    const handleSignUp = async (userData: User) => {
        setWaitingResponse(true);
        const { accessToken } = await dippiClient.auth.login();
        dippiClient.setAuthToken(accessToken);
        setError('');

        const response = await dippiClient.user.createProfile({
            email: userData.email,
            password: userData.password,
            applicationId: config.appId,
            authType: "email",
            phone: ""
        });

        if ('error' in response) {
            setError(response.message);
            setWaitingResponse(false);
            return;
        }

        const user = response as UserDippiResponseBody;

        if(user.isVerified === false) {
            setSignUpStatus('waitingEmailVerification');
            setUser(user);
            confirmEmailVerification(user.id);
            setWaitingResponse(false);
        };
    };

    const handleSignIn = async (userData: User) => {

        setWaitingResponse(true);
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

        if ('error' in response) {
            setError(response.message);
            setWaitingResponse(false);
            return;
        }

        const user = response.user as UserDippiResponseBody;
        setIsConnected(true);
        setUser(user as UserDippiResponseBody | null);
        setSignUpStatus('completed');
        setAddress(response.walletAddress)  
        setWaitingResponse(false);      
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

        try {
            let change = await dippiClient.user.changePassword({
                userEmail: changePasswordData.userEmail,
                oldPassword: changePasswordData.oldPassword,
                password: changePasswordData.password,
                repeatedPassword: changePasswordData.repeatedPassword
            });
            setIsChangedPassword(true);
        } catch (error) {
            setIsChangedPassword(false);
        }

    };

    const handlePasswordReset = async (email: string) => {
        const { accessToken } = await dippiClient.auth.login();
        dippiClient.setAuthToken(accessToken);
        try {
            const response = await dippiClient.user.resetPassword({email});
            if (response.status === 200) {
                setIsResetPassword(true);
            } else {
                setIsResetPassword(false);
            }
        } catch (error) {
            setIsResetPassword(false);
        }
    };

    const disconnect = () => {
        setUser(null);
        setAddress('');
        setIsConnected(false);
        setSignUpStatus('initial');
        setError('');
        localStorage.removeItem('dippiUserData');
    };

    const saveTokenPairOnLocalStorage = (tokenPair: TokenPair | null) => {
        if (!tokenPair) {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
        } else {
            const { accessToken, refreshToken } = tokenPair;
            localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
    };

    const handleConnectWallet = async ({
        address,
        walletType,
        topic,
    }: SignInConnectWalletPayloadType): Promise<TokenPair> => {
        setLoading(true);

        const validator = [
            '',
            process.env.NEXT_PUBLIC_VALIDATOR_CONNECT_WALLET_1,
            process.env.NEXT_PUBLIC_VALIDATOR_CONNECT_WALLET_2,
            process.env.NEXT_PUBLIC_VALIDATOR_CONNECT_WALLET_3,
            process.env.NEXT_PUBLIC_VALIDATOR_CONNECT_WALLET_4,
            process.env.NEXT_PUBLIC_VALIDATOR_CONNECT_WALLET_5,
        ].join('$');

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/connect-wallet`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        address,
                        walletType,
                        validator,
                        topic,
                    }),
                },
            );

            const { message, error, accessToken, refreshToken } =
                await response.json();

            if (!!error) {
                if (message instanceof Array) {
                    setError(message);
                } else {
                    setError([message]);
                }
                setTokenPair(null);
                saveTokenPairOnLocalStorage(null);
            } else {
                setError(null);
                setIsSignedIn(true);
                setTokenPair({ accessToken, refreshToken } as TokenPair);
                saveTokenPairOnLocalStorage({
                    accessToken,
                    refreshToken,
                } as TokenPair);
                setLoading(false);
            }
            return { accessToken, refreshToken } as TokenPair;
        } catch (error) {
            throw new Error(
                'Error Connect Wallet Address : ' +
                    address +
                    ' Error: ' +
                    error,
            );
        } finally {
            setLoading(false);
            // saveTokenPairOnLocalStorage(null);
        }
    };

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                signUpStatus,
                error,
                address,
                isConnected,
                isResetPassword,
                isChangedPassword,
                waitingResponse,
                handleSignIn, 
                handleSignUp,
                handlePasswordChange,
                handlePasswordReset,
                createWallet,
                disconnect,
                handleConnectWallet,
                setTokenPair
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
