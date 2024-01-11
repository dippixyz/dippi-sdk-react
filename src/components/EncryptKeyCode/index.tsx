import React, { useState, useRef, useEffect } from 'react';
import '../../styles/globals.css';

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
        if (showPossibleMsg) {
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
    }, [showPossibleMsg]);

    return (
        <div className="relative flex flex-col justify-center overflow-hidden">
            <div className="relative bg-white px-6 pt-10 pb-9  mx-auto w-full max-w-lg rounded-2xl border-2 border-black-500">
                <div className="mx-auto flex w-full max-w-md flex-col">
                    <div
                        className="flex flex-col items-center justify-center text-center space-y-2"
                        style={{ textAlign: 'justify' }}
                    >
                        <img
                            src={'https://app.dippi.xyz/assets/img/dippi-beta.png'}
                            alt="banner"
                            className="centered-image"
                        />
                        <div className="font-semibold text-3xl">
                            <p>Secret Code</p>
                        </div>
                        <div className="flex flex-row text-sm font-medium text-gray-500 mb-2">
                            <span>
                                <strong>ENCRYPT CODE</strong> : This will be your unique{' '}
                                <strong>secret code</strong> used to encrypt
                                your key. Make sure you can remember it safely
                                and store it in a secure place.
                            </span>
                        </div>
                        <div className="text-sm">
                            <span>
                                <strong>
                                    We won't be able to help you recover this
                                    code.
                                </strong>
                            </span>
                        </div>
                    </div>

                    <div>
                        <div>
                            <div className="flex flex-col">
                                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs mt-6 mb-6">
                                    {codes.map((code, index) => (
                                        <div className="w-16 h-16" key={index}>
                                            <input
                                                className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 text-black"
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

                                <div className="flex flex-col space-y-5">
                                    <div>
                                        {!buttonSubmited ? (
                                            <button
                                                className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-[#01b1ca] hover:bg-[#01b1ca] border-none text-white text-sm shadow-sm"
                                                onClick={handleSetCode}
                                            >
                                                Create Wallet
                                            </button>
                                        ) : (
                                            // Spinner animation in button content
                                            <div>
                                                <button className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-[#01b1ca] hover:bg-[#01b1ca] border-none text-white text-sm shadow-sm">
                                                    <div
                                                        className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                        role="status"
                                                    >
                                                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
                                                    </div>
                                                </button>
                                                {showPossibleMsg && (
                                                    <div className="mt-4">
                                                        <span className="text-xxl text-green">
                                                            {
                                                                possibleMessages[
                                                                    messageIndex
                                                                ]
                                                            }
                                                        </span>
                                                    </div>
                                                )}
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
    );
};

export default EncryptCode;
