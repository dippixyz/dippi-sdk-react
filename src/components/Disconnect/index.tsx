import React, { useState } from 'react';
import { useDippiContext } from '../DippiProvider';

interface DisconnectModalProps {
    isModalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function DisconnectModal({ isModalOpen, setModalOpen }: DisconnectModalProps) {

    // const [isModalOpen, setModalOpen] = useState(false);
    const { disconnect, address } = useDippiContext();
    const [isCopied, setIsCopied] = useState(false);


    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleDisconnect = () => {
        disconnect();
        setModalOpen(false);
    }

    const copyToClipboard = () => {
        try {
            navigator.clipboard.writeText(address);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 1000);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            {isModalOpen && (
                <div
                    id="popup-modal"
                    tabIndex={-1}
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-40"
                >
                    <div className="relative p-4 w-full max-w-md">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <h3 className='text-black title-disconnect'>Connected</h3>
                            <button
                                type="button"
                                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                data-modal-hide="popup-modal"
                                onClick={closeModal}
                            >
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-4 md:p-5 text-center">
                                <div className="circle"></div>
                                <h3 className={`mb-5 pt-2 text-lg font-normal text-gray-500 dark:text-gray-400 ${isCopied ? 'copied-text' : ''}`}>
                                    {address.slice(0, 6) + '••••' + address.slice(-4,)}
                                    <span
                                        className="ml-2 cursor-pointer"
                                        role="img"
                                        aria-label="Copy"
                                        onClick={copyToClipboard}
                                    >
                                        📋
                                    </span>                                    
                                </h3>

                                <button
                                    data-modal-hide="popup-modal"
                                    type="button"
                                    className="text-white hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                                    onClick={handleDisconnect}
                                    style={{ backgroundColor: '#ff0000' }}
                                >
                                    Disconnect
                                </button>
                                <button
                                    data-modal-hide="popup-modal"
                                    type="button"
                                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DisconnectModal;
