import React, { useState } from 'react';
import { useDippiContext } from '../DippiProvider';

import '../../output.css'
// "@dippixyz/sdk": "^1.0.5",

interface SignInFormProps {
    onClose: () => void;
    toggleForm: () => void;
}

export const SignInForm = ( {onClose, toggleForm }: SignInFormProps ) => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    
    const { handleSignIn } = useDippiContext();
    
    const handleEmailChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setEmail(e.target.value);
    };
    
    const handlePasswordChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setPassword(e.target.value);
    };





    const [showSignUp, setShowSignUp] = useState(false);

    return (
        <div className="modalContainer">
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
                    handleSignIn({ email, password });
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
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    > 
                        Sign In
                    </button>
                </div>
                <button onClick={toggleForm} className="block text-gray-700 text-sm font-bold mb-2">Don't have an account? Sign Up</button>
            </form>
        </div>
    );
};

export default SignInForm;
