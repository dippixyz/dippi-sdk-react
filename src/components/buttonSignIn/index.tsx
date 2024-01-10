// import React, { useState } from 'react';
import React from 'react';
// import 'tailwindcss/tailwind.css';
import styles from '../../styles.module.css';
import '../../output.css'
import {  SignInForm } from '../SignIn';

const ButtonSignIn =  () => {
    const [modalOpen, setModalOpen] = React.useState(false);
    
    const handleOpenModal = () => {
        setModalOpen(true)
    };

    return (
        
        <div className={styles.modalContainer}>
            { modalOpen && (
                <SignInForm 
                    onClose={() => setModalOpen(false)}
                />
            )}  
            <h6></h6>
            <button
                className="text-white font-bold py-2 px-4 rounded button-tba-main-2"
                onClick={() => {
                    handleOpenModal();
                }}
                style={{
                    marginLeft: '25px',
                    // marginRight:'3px'
                }}
            >Login with Dippi..</button>
        </div>
    );
};

export default ButtonSignIn;
