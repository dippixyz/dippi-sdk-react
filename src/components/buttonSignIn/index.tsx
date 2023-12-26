// import React, { useState } from 'react';
import React from 'react';
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
        
        <div className="m-4 rounded-xl border-2 border-gray-100">
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
            >Login with DIPPI</button>
        </div>
    );
};

export default ButtonSignIn;
