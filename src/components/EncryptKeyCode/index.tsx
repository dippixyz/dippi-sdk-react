import React, { useState, useRef, useEffect } from 'react';
import '../../styles/globals.css';
import AlertSuccess from '../../components/AlertSuccess';
import { useDippiContext } from '../../components/DippiProvider';

interface EncryptCodeProps {
    setCode: (code: string) => void;
    showPossibleMsg?: boolean;
}

const EncryptCode = ({ setCode, showPossibleMsg }: EncryptCodeProps) => {
    const [codes, setCodes] = useState<string[]>(['', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([
        null,
        null,
        null,
        null,
    ]);
    const [buttonSubmited, setButtonSubmited] = useState<boolean>(false);
    const { createWallet } = useDippiContext();

    const handleChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 1) {
            const newCodes = [...codes];
            newCodes[index] = value;
            setCodes(newCodes);

            // Move to the next input
            if (value.length === 1 && index < inputRefs.current.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleSetCode = () => {
        // Send the 4-digit code to an API
        console.log('code to encrypt key .....', codes)
        const code = codes.join('');
        if (code.length == 4) {
            setCode(code);
            setButtonSubmited(true);
            createWallet({
                userCode: code,
                environment: 'Main Net'
            });
        }
        // buttonSubmited convert to true
    };

    const [messageIndex, setMessageIndex] = useState(0);

    const possibleMessages = [
        'Creating Wallet...',
        'Generating Wallet...',
        'Waiting for the transaction to be confirmed ...',
        'Your wallet is ready!',
        'Just a little longer...',
        'Almost there...',
    ];

    useEffect(() => {
        if (showPossibleMsg || buttonSubmited ) {
            const interval = setInterval(() => {
                setMessageIndex((prevIndex) => {
                    const nextIndex = prevIndex + 1;
                    if (nextIndex < possibleMessages.length) {
                        return nextIndex;
                    } else {
                        clearInterval(interval);
                        return prevIndex;
                    }
                });
            }, 9000);
            return () => clearInterval(interval);
        }
        // }
    }, [showPossibleMsg, buttonSubmited]);

    return (
        <div
            className="grid modalContainer max-h-[620px]"
            style={{ backgroundImage: `url(/assets/img/wallpaper.png)` }}
        >
            <button
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
                    <div className="grid min-h-screen pb-14" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
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
                                <div className="relative flex flex-col overflow-hidden bg-white">
                                    <div className="max-w-xl px-5 text-center">
                                        <h2 className="mb-2 text-[20px] font-bold text-zinc-800">Encrypt Code</h2>
                                        <p className='text-sm'>
                                            This will be your unique{' '}
                                            <strong>secret code</strong> used to encrypt
                                            your key. Make sure you can remember it safely
                                            and store it in a secure place.
                                        </p>
                                        <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs mt-6 mb-6">
                                            {codes.map((code, index) => (
                                                <div className="w-16 h-16 p-1" key={index}>
                                                    <input
                                                        className="w-full h-full flex flex-col items-center justify-center text-center px-3 outline-none rounded-xl border border-[#a5a4a4] text-lg bg-white focus:bg-gray-50 focus:ring-1 text-black"
                                                        type="password"
                                                        name={`code${index}`} // Add name attribute
                                                        id={`code${index}`} // Add id attribute
                                                        maxLength={1}
                                                        value={code}
                                                        onChange={(e) =>
                                                            handleChange(index, e)
                                                        }
                                                        ref={(input) =>
                                                        (inputRefs.current[index] =
                                                            input)
                                                        }
                                                        inputMode="numeric"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            {!buttonSubmited ? (
                                                <button
                                                    className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-[#01b1ca] hover:bg-[#01b1ca] border-none text-white text-sm shadow-sm"
                                                    onClick={handleSetCode}
                                                >
                                                    Create Wallet
                                                </button>
                                            ) : (
                                                <div>
                                                    <button className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-[#01b1ca] hover:bg-[#01b1ca] border-none text-white text-sm shadow-sm">
                                                        <div
                                                            className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                            role="status"
                                                        >
                                                            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
                                                        </div>
                                                    </button>
                                                    <div className='mt-4'>
                                                        {(showPossibleMsg || buttonSubmited ) && (
                                                            <AlertSuccess message={possibleMessages[messageIndex]} />
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default EncryptCode;
