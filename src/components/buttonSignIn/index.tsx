// import { useState } from 'react';
import React , { useState } from 'react' ;
import {  SignInForm } from '../SignIn';

export const ButtonSignIn: React.FC= () => {
 
    const [activeTab, setActiveTab] = useState(false);
    const handleTabClick = () => {
        setActiveTab(true); // Actualiza el estado para reflejar la pestaña activa
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
            ></button>
        </div>
    );
};

export default ButtonSignIn;
