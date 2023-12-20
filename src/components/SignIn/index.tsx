// import { useState } from 'react';
import { Collapsible } from '../Collapsible';
import React from 'react';
// import { useAuth } from '../AuthContext';

export const SignInForm = () => {
    // const [email, setEmail] = useState<string>('');
    // const [password, setPassword] = useState<string>('');

    // const { error, handleSignIn } = useAuth();

    // const resetForm = () => {
    //     setEmail('');
    //     setPassword('');
    // };

    // useEffect(() => {
    //     if (!error) {
    //         resetForm();
    //     }
    // }, [error]);

    return (
        // <>
          // <h6>llego aqui 111111</h6>
          <Collapsible
            collapsed={true}
            title="Sign In"
            body={
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        // handleSignIn({ email, password });
                    }}
                >
                    {/* {!!error && (
                        <div className="mb-4 px-4 py-2 bg-red-50 text-red-500 border-2 border-red-500 rounded-md">
                            {error.map(
                                (errorMessage: string, index: string) => (
                                    <div key={`error-message-${index}`}>
                                        {errorMessage}
                                    </div>
                                ),
                            )}
                        </div>
                    )} */}
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="signin-email"
                        >
                            Email
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
                            Password
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
                </form>
            }
          />
        // </>
        
    );
};

export default SignInForm;
