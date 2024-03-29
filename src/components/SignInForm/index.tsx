import { useState, useEffect } from 'react';
import { useDippiContext } from '../DippiProvider';
import AlertError from '../AlertError';
import { ResetPasswordForm } from '../ResetPasswordForm';

export const SignInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {  handleSignIn , error, waitingResponse } = useDippiContext();
    const [usePassword, setUsePassword] = useState(false);
    const [users, setUsers] = useState([
        { email: '', registered_passkey: false },
    ]);
    const [showPasswordReset, setShowPasswordReset] = useState<boolean>(false);

    const handleSubmit = async () => {
        handleSignIn({ email, password });
    };

    const handleShowPasswordReset = () => {
        setShowPasswordReset(!showPasswordReset);
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
    };

    const validateEmail = (email: string) => {
        const regex = /^[a-zA-Z0-9._+\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        return regex.test(email);
    };

    const getCookie = (name: string) => {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0)
                return JSON.parse(c.substring(nameEQ.length, c.length));
        }
        return null;
    };

    const checkForValidPasskey = async (_email: string) => {
        setEmail(_email);
        // authenticatePasskey(_email);
    };

    const handleEmailChange = (e: any) => {
        setEmail(e.target.value);
        const email = e.target.value;
        if (email === '') {
            setUsePassword(false);
        }
        if (validateEmail(e.target.value)) {
            checkForValidPasskey(email);
        }
    };

    useEffect(() => {
        try {
            if (users[0].email === '') {
                users.shift();
            }
            const cookieUsers = getCookie('user');
            if (cookieUsers) {
                setUsers(cookieUsers);
            }
        } catch (error) {}
    }, []);

    useEffect(() => {
        resetForm();
    }, []);

    return (
        <>
            {showPasswordReset ? (
                <ResetPasswordForm />
            ) : (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="max-w-[320px]"
                >
                
                    {!!error && (
                        <AlertError title="Error" message={error} />
                    )}

                    {/^\+?\d+$/.test(email) && (
                        <div className="mb-6 -space-y-px items-center shadow appearance-none border rounded">
                        </div>
                    )}
                    <div className="flex mb-6 items-center shadow appearance-none border rounded">
                        <input
                            className="text-xl w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="signin-email"
                            name="email"
                            type="text"
                            autoComplete="webauthn"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => {
                                handleEmailChange(e);
                            }}
                        />
                    </div>
                    <div className="mb-8">
                        <input
                            className="text-xl shadow appearance-none border rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="signin-password"
                            name="password"
                            type="password"
                            autoComplete="webauthn"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <small style={{fontSize: '15px'}}>
                            {' '}
                            Forgot your password?{' '}
                            <a 
                                href="#" 
                                className="text-[#33d4e4]" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleShowPasswordReset();
                                }}
                            >
                                Reset it here
                            </a>
                        </small>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="text-xl bg-[#01b1ca] hover:bg-[#01b1ca] w-full text-white font-bold py-4 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                            disabled={waitingResponse}
                            id="button-login"
                        >
                            {
                                waitingResponse ? (
                                    <div
                                        className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                        role="status"
                                    >
                                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
                                    </div>
                                ) : (
                                    'Sign In'
                                )
                            }
                        </button>
                    </div>
                </form>
            )}
        </>
    );
};

export default SignInForm;
