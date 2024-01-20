import React, { useState, useEffect } from 'react';
import { useDippiContext } from '../DippiProvider';
export const ResetPasswordForm = () => {
    const [email, setEmail] = useState('');
    const { handlePasswordReset, isResetPassword } = useDippiContext();
    const [errorLogin, setErrorLogin] = useState('');
    const [usePassword, setUsePassword] = useState(false);
    const [users, setUsers] = useState([
        { email: '', registered_passkey: false },
    ]);

    const handleSubmit = async () => {
        if (validateEmail(email)) {
            handlePasswordReset(email);
            if (isResetPassword) {
                setErrorLogin('Please check your email to reset password.');
            } else {
                setErrorLogin('Reset password failed.');
            }
        } else {
            setErrorLogin('Invalid email');
        }
    };

    const resetForm = () => {
        setEmail('');
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

    const handleEmailChange = (e: any) => {
        setEmail(e.target.value);
        const email = e.target.value;
        if (email === '') {
            setUsePassword(false);
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
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
            className="max-w-[320px]"
        >
         
            {!!errorLogin && (
                <div className="mb-4 px-4 py-2 bg-red-50 text-red-500 border-2 border-red-500 rounded-md">
                    {errorLogin}
                </div>
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
            <div className="flex items-center justify-between">
                <button
                    className="text-xl bg-[#01b1ca] hover:bg-[#01b1ca] w-full text-white font-bold py-4 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                    id="button-login"
                >
                    Reset Password
                </button>
            </div>
        </form>
    );
};

export default ResetPasswordForm;
