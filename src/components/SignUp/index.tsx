import React, { useState } from 'react';
import { useDippiContext } from '../DippiProvider';

import '../../output.css'
// "@dippixyz/sdk": "^1.0.5",

interface SignUpFormProps {
    onClose: () => void;
    toggleForm: () => void;
}

export const SignUpForm = ( {onClose, toggleForm }: SignUpFormProps ) => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    
    const { handleSignUp} = useDippiContext();
    const [acceptTermsAndConditions, setAcceptTermsAndConditions] =
        useState<boolean>(false);
    const handleEmailChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setEmail(e.target.value);
    };
    
    const handlePasswordChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setPassword(e.target.value);
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    
    const [showSignUp, setShowSignUp] = useState(false);

    return (
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
                    handleSignUp({ email, password });
                }}
            >
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="signin-email"
                    >
                        Email:
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="signin-email"
                        name="email"
                        type="text"
                        placeholder="Email"
                        onChange={handleEmailChange}
                        // value={email}
                        // onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="signin-password"
                    >
                        Password:
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="signin-password"
                        name="password"
                        type="password"
                        placeholder="******************"
                        onChange={handlePasswordChange}
                        // value={password}
                        // onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center justify-between">
                    <input
                        className="shadow border rounded px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="signup-terms-and-conditions"
                        name="terms-and-conditions"
                        type="checkbox"
                        checked={acceptTermsAndConditions}
                        required
                        onChange={(e) => {
                            setAcceptTermsAndConditions(e.target.checked);
                        }}
                    />
                    <label
                        className="block text-gray-700 text-sm font-bold"
                        htmlFor="signup-terms-and-conditions"
                    >
                        <button
                            onClick={handleOpenModal}
                            className="btn-bg rounded-md p-2 ml-4"
                            style={{
                                color: '#01b1ca',
                                backgroundColor: 'transparent',
                            }}
                        >
                            Accept terms and conditions
                        </button>
                    </label>
                </div>
                    

                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Sign Up
                    </button>
                </div>
                <button onClick={toggleForm} className="block text-gray-700 text-sm font-bold mb-2">Already have an account? Sign In</button>
            </form>
        </div>
    )

};

export default SignUpForm;
