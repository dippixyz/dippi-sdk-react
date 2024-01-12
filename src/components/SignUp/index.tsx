import React, { useState } from 'react';
import SignUpForm from '../SignUpForm';
import '../../output.css'
// "@dippixyz/sdk": "^1.0.5",

interface SignUpFormProps {
    onClose: () => void;
    toggleForm: () => void;
}

export const SignUp = ( {onClose, toggleForm }: SignUpFormProps ) => {
    const possibleMessages = [
        'Connecting your Wallet...',
        'Generating Wallet...',
        'Waiting for the transaction to be confirmed ...',
        'Your wallet is connected!',
        'Just a little longer...',
    ];

    const [messageIndex, setMessageIndex] = useState(0);
    const [show, setShow] = useState(false);


    return (
        <>
            <div
                className="grid modalContainer max-h-[620px]"
                style={{ backgroundImage: `url(/assets/img/wallpaper.png)` }}
            >
                <button
                    onClick={onClose}
                    className="bg-[#47b0bf] hover:bg-[#69d1e0] text-white font-bold px-2 rounded"
                    style={{
                        position: 'absolute',
                        top: '4px',
                        right: '5px',
                        cursor: 'pointer',
                    }}
                >
                    x
                </button>
                <div className="flex items-center justify-center mt-6">
                    <div className="w-full max-w-[320px]">
                        <div className="grid min-h-screen pb-14" style={{paddingLeft: '15px' , paddingRight: '15px'}}>
                            <div className="flex justify-center">
                                <div className="pb-14">
                                    <div className="img-modal flex justify-center mb-4">
                                        <img
                                            alt="Dippi"
                                            src="https://app.dippi.xyz/assets/img/logo-beta.png"
                                            width={100}
                                            height={100}
                                        />
                                    </div>
                                    <h1
                                        className="mb-6 text-4xl text-center"
                                        style={{ fontWeight: 600 }}
                                    >
                                        Sign Up
                                    </h1>
                                    {!show && (
                                        <>
                                            <div className="mb-5">
                                                <SignUpForm />
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <div style={{fontSize: '15px'}}>
                                                    Already have an account?
                                                </div>
                                                <div
                                                    className="text-[#01b1ca] hover:text-[#01b1ca] cursor-pointer ml-2"
                                                    onClick={toggleForm}
                                                    style={{ width: '63px' , fontSize: '15px'}}
                                                    >
                                                    Sign In
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
