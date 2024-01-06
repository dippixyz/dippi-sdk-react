// import { useState } from 'react';
// import { Collapsible } from '../Collapsible';
import React, { useState } from 'react';

// import styles from "../../styles.module.css";
import '../../output.css'
// "@dippixyz/sdk": "^1.0.5",
import { Dippi } from '@dippixyz/sdk';



interface SignInFormProps {
    onClose: () => void;
    appToken : string;
    appId : string;
    url : string;
}

export const SignInForm = ( {onClose, appToken , appId, url }: SignInFormProps ) => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    

    const handleEmailChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setEmail(e.target.value);
    };
    
    const handlePasswordChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setPassword(e.target.value);
    };

    const dippiClient = new Dippi({
        appToken: appToken,
        appId: appId,
        url: url,
    });

    
    const onclickSignIn = async () => {
        console.log('call login1111111111', password, email)
        const { accessToken } = await dippiClient.auth.login();
        dippiClient.setAuthToken(accessToken);
        // const response = await dippiClient.user.authenticate(email , password )
        

        let user = await dippiClient.user.authenticate({
            email: email,
            password: password,
            token: appToken,
            applicationId: appId,
            countryCode: ""
        });
        console.log("user", user);

        // console.log('var Dippi 333 >>>>>>>>>>>>>', )
    
    };


    const onclickSignUP = async () => {
        const { accessToken } = await dippiClient.auth.login();
        dippiClient.setAuthToken(accessToken);
        
        let user = await dippiClient.user.createProfile({
            email: email,
            password: password,
            applicationId: appId,
            authType:"email",
            phone: ""
        });
        console.log("user", user);

    };


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
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                            onClick={onclickSignUP}
                        >
                            Sign Up
                        </button>
                    </div>
                    <button onClick={toggleForm} className="block text-gray-700 text-sm font-bold mb-2">Already have an account? Sign In</button>
                </form>
            </div>
        ) : (
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
                            onClick={onclickSignIn}
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
