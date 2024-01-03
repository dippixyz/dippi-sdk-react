// import React, { useState } from 'react';
import React from 'react';
// import 'tailwindcss/tailwind.css';
import styles from '../../styles.module.css';
import '../../output.css'
import {  SignInForm } from '../SignIn';

// import ReactDOM from 'react-dom';
// interface propActiveTab {
//     activeTab: boolean;
// }

const ButtonSignIn: React.FC =  () => {
    const [activeTab, setactiveTab] = React.useState(false);
    const handleTabClick = () => {
        setactiveTab(true)
    };


    return (
        
        <div className={styles.modalContainer}>
            { activeTab && (
                <SignInForm />
            )}  
            <h6></h6>
            <button
                className="text-white font-bold py-2 px-4 rounded button-tba-main-2"
                onClick={() => {
                    handleTabClick();
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
