import React, { useState } from 'react';
import { useDippiContext } from '../DippiProvider';

import '../../output.css'
// "@dippixyz/sdk": "^1.0.5",

interface ChangePasswordFormProps {
    onClose: () => void;
    email: string;
}

export const ChangePasswordForm = ( {onClose, email }: ChangePasswordFormProps ) => {
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [errorLogin, setErrorLogin] = useState('');
    
    const { handlePasswordChange: handlePasswordChange_} = useDippiContext();
    
    const handleOldPasswordChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setOldPassword(e.target.value);
    };

    const handlePasswordChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setPassword(e.target.value);
    };

    const handleRepeatPasswordChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setRepeatPassword(e.target.value);
    };

    const [showSignUp, setShowSignUp] = useState(false);

    const toggleForm = () => setShowSignUp(!showSignUp);

    return (
        <>
            {/* <div className="modalContainer"> */}
                {/* Sign Up Form Fields */}
                <button
                    onClick={onClose}
                    className="bg-[#47b0bf] hover:bg-[#69d1e0] text-white font-bold py-2 px-4 rounded"
                    style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        cursor: 'pointer',
                    }}
                >
                    x
                </button>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!oldPassword) {
                            setErrorLogin('Old password field must be filled!');
                            return;
                        }
                        if (!password) {
                            setErrorLogin('New password field must be filled!');
                            return;
                        }
                        if (!repeatPassword) {
                            setErrorLogin('Repeat new password field must be filled!');
                            return;
                        }
                        const change = handlePasswordChange_( {userEmail: email, oldPassword, password, repeatedPassword: repeatPassword} )
                        console.log('change password...:', change);
                    }}
                    className="max-w-[320px]"
                >
                    {!!errorLogin && (
                        <div className="mb-4 px-4 py-2 bg-red-50 text-red-500 border-2 border-red-500 rounded-md">
                            {errorLogin}
                        </div>
                    )}
                    <div className="flex mb-6 items-center shadow appearance-none border rounded">
                        {/* <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="email"
                        >
                            Email:
                        </label> */}
                        <input
                            className="text-xl w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="signin-email"
                            name="email"
                            type="text"
                            // placeholder="Email"
                            // onChange={handleEmailChange}
                            value={email}
                            readOnly
                        />
                    </div>
                    <div className="flex mb-6 items-center shadow appearance-none border rounded">
                        {/* <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="old-password"
                        >
                            Old Password:
                        </label> */}
                        <input
                            className="text-xl w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="old-password"
                            name="oldPassword"
                            type="password"
                            placeholder="Old Password"
                            onChange={handleOldPasswordChange}
                        />
                    </div>
                    <div className="flex mb-6 items-center shadow appearance-none border rounded">
                        {/* <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="signin-password"
                        >
                            New Password:
                        </label> */}
                        <input
                            className="text-xl w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="signin-password"
                            name="password"
                            type="password"
                            placeholder="New Password"
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div className="flex mb-6 items-center shadow appearance-none border rounded">
                        {/* <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="repeat-password"
                        >
                            Repeat New Password:
                        </label> */}
                        <input
                            className="text-xl w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="repeat-password"
                            name="repeatPassword"
                            type="password"
                            placeholder="Repeat New Password"
                            onChange={handleRepeatPasswordChange}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="text-xl bg-[#01b1ca] hover:bg-[#01b1ca] w-full text-white font-bold py-4 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Change Password
                        </button>
                    </div>
                </form>
            {/* </div> */}
        </>
    );
};

export default ChangePasswordForm;