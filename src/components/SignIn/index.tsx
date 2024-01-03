// import { useState } from 'react';
// import { Collapsible } from '../Collapsible';
import React, { useState } from 'react';
// import styles from "../../styles.module.css";
import '../../output.css'

export const SignInForm = () => {
    const [showSignUp, setShowSignUp] = useState(false);

    const toggleForm = () => setShowSignUp(!showSignUp);

    const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Logic for sign-in
    };
    
    const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Logic for sign-up
    };
    

    return showSignUp ? (
            <div className="modalContainer">
                {/* Sign Up Form Fields */}
                <form
                    onSubmit={handleSignUp}
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
                            // value={password}
                            // onChange={(e) => setPassword(e.target.value)}
                        />
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
        ) : (
          <div className="modalContainer">
                <form
                    onSubmit={handleSignIn}
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
                            // value={password}
                            // onChange={(e) => setPassword(e.target.value)}
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
        // </>
        
    );
};

export default SignInForm;
