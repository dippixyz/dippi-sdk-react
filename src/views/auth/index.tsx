import React, { useState, useEffect } from 'react';
import styles from '../../styles.module.css';
import '../../output.css'
import {  SignIn } from '../../components/SignIn';
import {  SignUp } from '../../components/SignUp';
import { useDippiContext } from '../../components/DippiProvider';
import ConfirmEmail from '../../components/ConfirmEmail';
import EncryptKeyCode from '../../components/EncryptKeyCode';

const AuthenticationView =  () => {

    // Hooks
    const [modalOpen, setModalOpen] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);
    const { signUpStatus } = useDippiContext();
    const [codeEncrypt, setCodeEncrypt] = useState('');

    // Functions
    const toggleForm = () => {
        setIsSigningUp(!isSigningUp);
    };

    const handleOpenModal = () => {
        setModalOpen(true)
    };
    

    useEffect(() => {
        if (signUpStatus){
            console.log('signUpStatus in AuthView >>>>>>>>>>>', signUpStatus);
        }
    }, [signUpStatus]);


    return (
        
        <div className={styles.modalContainer}>
            { modalOpen && (
                <div>
                    {
                        isSigningUp ? 
                            signUpStatus === 'initial' ? 
                                <SignUp toggleForm={toggleForm} onClose={() => setModalOpen(false)} />
                            : signUpStatus === 'waitingEmailVerification' ?
                                <ConfirmEmail success={false}/>
                            : signUpStatus === 'verified' ?
                                <ConfirmEmail success={true}/>
                            : signUpStatus === 'waitingEncryptKeyCode' ?
                                <EncryptKeyCode setCode={setCodeEncrypt}/>
                            : signUpStatus === 'completed' ?
                                <p>completed</p>
                            : null
                        : 
                            <SignIn onClose={() => setModalOpen(false)} toggleForm={toggleForm} />
                    }
                </div>
            )}  
            <h6></h6>
            <button
                className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                onClick={() => {
                    handleOpenModal();
                }}
            >
                <div className="flex items-center">
                    <img src="https://client.dippi.xyz/assets/img/logo.png" alt="Dippi Icon" style={{width:30, marginRight:4}} />
                    <span>Continue with Dippi</span>
                </div>
            </button>
        </div>
    );
};

export default AuthenticationView;
