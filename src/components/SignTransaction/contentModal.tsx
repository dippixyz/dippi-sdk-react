import React, { useState, useRef } from 'react';
import { addObjectToDB } from '../../utils/functions/indexDB';

interface ContentModalProps {
    setCode: (code: string) => void;
    setOpenModal: (openModal: boolean) => void;
}

const ContentModal = ({ setCode, setOpenModal }: ContentModalProps) => {
    const [codes, setCodes] = useState<string[]>(['', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([
        null,
        null,
        null,
        null,
    ]);

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

    async function myHandleSetCode() {
        const code = codes.join('');
        if (code.length === 4) {
            setCode(code);
            setOpenModal(false);

            const safeWallet = {
                id: '1',
                value: code,
            };

            await addObjectToDB(safeWallet);
        }
    }


    return (
        <div className="relative flex flex-col justify-center overflow-hidden bg-gray-50">
            <div className="relative bg-white mx-auto w-full max-w-lg rounded-2xl">
                <div className="mx-auto flex w-full max-w-md flex-col">
                    <div
                        className="flex flex-col items-center justify-center text-center space-y-2"
                        style={{ textAlign: 'justify' }}
                    >
                        <div className="flex flex-row text-sm font-medium text-gray-500 mb-2">
                            <span>
                                Inputting a correct {' '}
                                <strong>secret code</strong> will sign
                                and send this transaction.
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
                                                className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                                                type="password"
                                                name={`code${index}`} 
                                                id={`code${index}`} 
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
                            </div>
                        </div>
                        <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button"
                                style={{ backgroundColor: 'red' }}
                                className="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                onClick={() => myHandleSetCode()}
                            >
                                Sign
                            </button>
                            <button
                                type="button"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                onClick={() => setOpenModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentModal;
