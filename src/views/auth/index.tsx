import React, { useState } from 'react';
import styles from '../../styles.module.css';
import '../../output.css'
import { SignIn } from '../../components/SignIn';
import { SignUp } from '../../components/SignUp';
import { useDippiContext } from '../../components/DippiProvider';
import ConfirmEmail from '../../components/ConfirmEmail';
import EncryptKeyCode from '../../components/EncryptKeyCode';
import DisconnectModal from '../../components/Disconnect';

const AuthenticationView = () => {

    // Hooks
    const [modalOpen, setModalOpen] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);
    const { signUpStatus, address, isConnected, user } = useDippiContext();
    const [codeEncrypt, setCodeEncrypt] = useState('');
    const [openModalDiscconect, setOpenModalDiscconect] = useState(false);

    // Functions
    const toggleForm = () => {
        setIsSigningUp(!isSigningUp);
    };

    const handleOpenModal = () => {
        setModalOpen(true)
    };

    return (
        <div className={styles.modalContainer}>
            <DisconnectModal isModalOpen={openModalDiscconect} setModalOpen={setOpenModalDiscconect} />
            {modalOpen && !isConnected && (
                <div>
                    {
                        isSigningUp ?
                            signUpStatus === 'initial' ?
                                <SignUp toggleForm={toggleForm} onClose={() => setModalOpen(false)} />
                            : signUpStatus === 'waitingEmailVerification' ?
                                <ConfirmEmail success={false} email={user?.email}/>
                            : signUpStatus === 'verified' ?
                                <ConfirmEmail success={true} email={user?.email}/>
                            : signUpStatus === 'waitingEncryptKeyCode' ?
                                <EncryptKeyCode setCode={setCodeEncrypt} />
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
                    if (isConnected) {
                        setOpenModalDiscconect(true);
                        return;
                    }
                    handleOpenModal();
                }}
            >
                {
                    !isConnected ?
                        <div className="flex items-center">
                            <img src="https://client.dippi.xyz/assets/img/logo.png" alt="Dippi Icon" style={{ width: 30, marginRight: 4 }} />
                            <span>Continue with Dippi</span>
                        </div>
                    :
                        <div className="flex items-center justify-center space-x-10">
                            <div className="flex items-center space-x-3">
                                <svg height={30} width={30} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/></svg>
                                <div>
                                    <span className="text-white text-md font-medium">{address.slice(0,6) + '••••' + address.slice(-4, )}</span>
                                </div>
                            </div>
                        </div>
                }
            </button>
        </div>
    );
};

export default AuthenticationView;
