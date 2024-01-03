import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { TokenPair } from '../../interfaces/tokenPair.interface';
import { useRouter } from 'next/router';
import { User } from '../../interfaces/users.interface';
import mixpanel from 'mixpanel-browser';
import { captureException, setContext } from '@sentry/nextjs';
import {
    SignInConnectWalletPayloadType,
    SignInPayloadType,
    SignUpPayloadType,
    PasskeySignInPayloadType,
} from 'interfaces/authContext';
import { useDisconnect } from 'wagmi';

mixpanel.init(
    // `${process.env.NEXT_PUBLIC_MIXPANE_PROJECT_ID}`,
    `${process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_ID}`,
    { persistence: 'localStorage' },
);

interface AuthContextType {
    tokenPair?: TokenPair;
    loading: boolean;
    error?: any;
    isSignedIn: boolean;
    signupState: string;
    isSignup: boolean;
    userSession?: User;
    isVerified: boolean;
    activeChainId: number;
    handleSignUp: ({
        email,
        password,
        acceptTermsAndConditions,
        referralCode,
    }: SignUpPayloadType) => void;
    handleSignIn: ({ email, password, countryCode }: SignInPayloadType) => void;
    handlePasskeySignIn: ({
        authentication,
        email,
        id,
    }: PasskeySignInPayloadType) => void;
    handleSignOut: () => void;
    verifySession: (state?: string) => void;
    resetError: () => void;
    setTokenPair: (tokenPair: TokenPair | null) => void;
    saveTokenPairOnLocalStorage: (tokenPair: TokenPair | null) => void;
    handleVerifyEmail: (clientId: string, email: string) => void;
    handleConnectWallet: (
        data: SignInConnectWalletPayloadType,
    ) => Promise<TokenPair>;
    getTokenPairFromLocalStorage: () => TokenPair | null;
    setIsSignedIn: (isSignedIn: boolean) => void;
    setIsVerified: (isVerified: boolean) => void;
    setSignupState: (signupState: string) => void;
    setActiveChainId: (activeChainId: number) => void;
}

interface AuthProviderPropsType {
    children: ReactNode;
}

const ACCESS_TOKEN_KEY = 'dippi-access-token';
const REFRESH_TOKEN_KEY = 'dippi-refresh-token';
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: AuthProviderPropsType) => {
    const [tokenPair, setTokenPair] = useState<TokenPair | null>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>();
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
    const [signupState, setSignupState] = useState<string>('');
    const [isSignup, setIsSignup] = useState<boolean>(false);
    const router = useRouter();
    const [userSession, setuserSession] = useState<User>();
    // const [windowDefined, setWindowDefined] = useState<boolean>(false);
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const { disconnect } = useDisconnect();
    const [activeChainId, setActiveChainId] = useState<number>(0);
    // const { connector } = useAccount();

    const handleActiveChainId = () => {
        if (typeof window !== 'undefined') {
            const lsactiveChainId = localStorage.getItem('activeChainId');

            if (lsactiveChainId) {
                setActiveChainId(parseInt(lsactiveChainId));
            }
        }
    };

    const resetError = () => {
        setError(null);
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

    const handleSignUp = async ({
        email,
        password,
        acceptTermsAndConditions,
        referralCode,
    }: SignUpPayloadType) => {
        setLoading(true);
        // setError(null);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/signup-user`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        acceptTermsAndConditions,
                        referralCode,
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
                setTokenPair({ accessToken, refreshToken } as TokenPair);
                saveTokenPairOnLocalStorage({
                    accessToken,
                    refreshToken,
                } as TokenPair);
                setIsSignup(true);
            }
        } catch (error) {
            setContext('user', { email: email });
            captureException(error);
        } finally {
            mixpanel.identify(email);
            router.push('/auth/signup?state=userCreated');
            mixpanel.track(
                'FrontEnd AuthContext-SignUpPayloadType  Successful sign up',
            );
            setLoading(false);
        }
    };

    const handleSignIn = async ({
        email,
        password,
        countryCode,
    }: SignInPayloadType) => {
        setLoading(true);
        // build email from phone number , example +50433535019 => 50433535019@dippi.com
        // Check if email is a phone number
        if (email.match(/^\d+$/)) {
            email = `${countryCode ? countryCode : '504'}${email}@dippi.com`;
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/signin-user`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
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
                setActiveChainId(137);
                localStorage.setItem('activeChainId', '137');
                setLoading(false);
                router.push('/home');
            }
        } catch (error) {
            setContext('user', { email: email });
            captureException(error);
        } finally {
            mixpanel.identify(email);
            mixpanel.track(
                'FrontEnd AuthContext-handleSignIn Successful sign in',
            );
            setLoading(false);
            // saveTokenPairOnLocalStorage(null);
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
            mixpanel.track(
                'FrontEnd AuthContext-handleConnectWallet Successful sign in',
            );
            setLoading(false);
            // saveTokenPairOnLocalStorage(null);
        }
    };

    const handlePasskeySignIn = async ({
        authentication,
        email,
        id,
    }: PasskeySignInPayloadType) => {
        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/passkey-verify-authentication-response/?id=${id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(authentication),
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
                router.push('/home');
            }
        } catch (error) {
            throw error;
        } finally {
            mixpanel.identify(email);
            mixpanel.track(
                'FrontEnd AuthContext-handlePasskeySignIn Successful sign in',
            );
            setLoading(false);
        }
    };

    const handleSignOut = () => {
        const no_passkeyArray = localStorage.getItem('no_passkey_array');
        mixpanel.track('FrontEnd AuthContext-handleSignOut Sign out attempt');
        disconnect();
        setTokenPair(null);
        saveTokenPairOnLocalStorage(null);
        setIsSignedIn(false);
        localStorage.clear();
        mixpanel.track(
            'FrontEnd AuthContext-handleSignOut Successful sign out',
        );
        if (no_passkeyArray)
            localStorage.setItem('no_passkey_array', no_passkeyArray);
        window.location.href = `${process.env.NEXT_PUBLIC_SNAPPI_UI_URL}/`;
    };

    const verifySession = async () => {
        const tokenPairFromLocalStorage = getTokenPairFromLocalStorage();
        let tokenPairToUse = tokenPair;

        if (!tokenPairToUse || tokenPairToUse.accessToken == 'undefined') {
            tokenPairToUse = tokenPairFromLocalStorage;
        }

        if (!tokenPairToUse) {
            handleSignOut();
            return;
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/v1/users`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${tokenPairToUse.accessToken}`,
                    },
                },
            );
            const result = await response.json();
            if (
                result.status === 404 ||
                result.status === 401 ||
                result.status === 400
            ) {
                handleSignOut();
            } else {
                const user = result;
                setSignupState(user.singupState);
                sessionStorage.setItem('userSession', JSON.stringify(user));
                const activeChainIdLs = localStorage.getItem('activeChainId');

                // sino tiene un activeChainId en el local storage, y el user.email es un correo valido, esto se comprueba
                // revisando si user.email contiene un @, entonces se le asigna el activeChainId 137
                if (!activeChainIdLs && user.email.includes('@')) {
                    setActiveChainId(137); // 137 = Polygon Mainnet by default
                    localStorage.setItem('activeChainId', '137'); // 137 = Polygon Mainnet by default
                }

                if (user.isVerified) {
                    setuserSession(user);
                    setIsSignedIn(true);
                    setIsVerified(true);
                } else {
                    setuserSession(user);
                    setIsVerified(false);
                    setIsSignedIn(false);
                    handleSignOut();
                }
            }
        } catch (error) {
            handleSignOut();
        }
    };

    // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // function testValidEmail(email: string): boolean {
    //     return emailRegex.test(email);
    // }

    const handleVerifyEmail = async (guid: string, token: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/verify-email-client/${guid}/${token}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );

            const data = await response.json();
            if (data.isVerified) {
                setError(false);
                setIsVerified(true);
            } else {
                setError(true);
            }
        } catch (error) {
            captureException(error);
        }
    };

    const getTokenPairFromLocalStorage = () => {
        if (typeof window !== 'undefined') {
            const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
            const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

            if (accessToken === null || refreshToken === null) {
                return null;
            } else {
                return { accessToken, refreshToken } as TokenPair;
            }
        } else {
            return null;
        }
    };

    useEffect(() => {
        if (
            tokenPair &&
            router.pathname !== '/auth/external-signup/[...id]' &&
            router.pathname !== '/auth/verify-user/[...confirm]' &&
            router.pathname !== '/auth/[signup]'
        ) {
            verifySession();
        }
    }, [tokenPair]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
            const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
            handleActiveChainId();

            if (accessToken === null || refreshToken === null) {
                setTokenPair(null);
            } else {
                setTokenPair({ accessToken, refreshToken } as TokenPair);
            }
        }
    }, []);

    /*
    useEffect(
        () => {
            if (!tokenPair) {
                localStorage.removeItem(ACCESS_TOKEN_KEY);
                localStorage.removeItem(REFRESH_TOKEN_KEY);
            } else {
                localStorage.setItem(ACCESS_TOKEN_KEY, tokenPair.accessToken);
                localStorage.setItem(REFRESH_TOKEN_KEY, tokenPair.refreshToken);
            }
        },
        [tokenPair]
    )
    */

    const value = useMemo(() => {
        // Asegurarte de que tokenPair no sea null
        const newTokenPair = tokenPair || { accessToken: '', refreshToken: '' };

        return {
            tokenPair: newTokenPair as TokenPair,
            loading,
            error,
            isSignedIn,
            signupState,
            isSignup,
            userSession,
            isVerified,
            activeChainId,
            handleSignUp,
            handleSignIn,
            handlePasskeySignIn,
            handleSignOut,
            resetError,
            setTokenPair,
            saveTokenPairOnLocalStorage,
            verifySession,
            handleVerifyEmail,
            handleConnectWallet,
            getTokenPairFromLocalStorage,
            setIsSignedIn,
            setIsVerified,
            setSignupState,
            setActiveChainId,
        };
    }, [
        tokenPair,
        loading,
        error,
        isSignedIn,
        signupState,
        isSignup,
        userSession,
        isVerified,
        activeChainId,
    ]);

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default useAuth;
