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
            <div className="modalContainer">
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
                        // handleSignUp({ email, password });
                        handlePasswordChange_( {userEmail: email, oldPassword, password, repeatedPassword: repeatPassword} )
                    }}
                >
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="email"
                        >
                            Email:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="signin-email"
                            name="email"
                            type="text"
                            // placeholder="Email"
                            // onChange={handleEmailChange}
                            value={email}
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="old-password"
                        >
                            Old Password:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="old-password"
                            name="oldPassword"
                            type="password"
                            placeholder="******************"
                            onChange={handleOldPasswordChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="signin-password"
                        >
                            New Password:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="signin-password"
                            name="password"
                            type="password"
                            placeholder="******************"
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="repeat-password"
                        >
                            Repeat New Password:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="repeat-password"
                            name="repeatPassword"
                            type="password"
                            placeholder="******************"
                            onChange={handleRepeatPasswordChange}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Change Password
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ChangePasswordForm;