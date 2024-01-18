import { useState, useRef, useEffect } from 'react';
import { ethers } from 'ethers';
import SignTransaction from '../SignTransaction';
import { useDippiContext } from '../../components/DippiProvider';
import { getCanRetrievePkById } from '../../utils/functions/indexDB';
import { enc, AES } from 'crypto-js';
import { setProvider, ProviderPayload } from '../../utils/functions/providers';

export const TransactionForm = (props: ProviderPayload) => {
    const { signUpStatus, address, isConnected, user } = useDippiContext();
    const [destinationAddress, setDestinationAddress] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [gasCost, setGasCost] = useState<bigint>(ethers.parseEther('0'));
    const [gasLimit, setGasLimit] = useState<ethers.BigNumberish>(ethers.parseEther('0'));
    const [trxTotal, setTrxTotal] = useState<ethers.BigNumberish>(0);
    const [tx, setTx] = useState<ethers.TransactionRequest>({});
    const [error, setError] = useState(null);
    const gasFlag = useRef<boolean>(false);
    // const decryptCodeFlag = useRef<boolean>(false);
    const [decryptCodeFlag, setDecryptCodeFlag] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [notificationText, setNotificationText] = useState<string>(
        'Your private key has been copied to your clipboard!',
    );
    const [invalidCode, setInvalidCode] = useState<boolean>(false);
    const [showInputCopy, setShowInputCopy] = useState<boolean>(false);
    const [content, setContent] = useState<string>('');

    console.log('signUpStatus...:', signUpStatus);
    console.log('address...:', address);
    console.log('user...:', user);
    // console.log(user?.id);
    
    
    let provider = setProvider(props);
    console.log('provider...:', provider);

    const decrypt = (code: string) => {
        const encryptionKey = code;
        console.log('encryptionKey...:', encryptionKey);
        console.log('user...:', user);
        
        
        // const walletId =
        //     localStorage.getItem('walletId') || getWalletIdFromLocalStorage();
        if (user && !user?.id) {
            // user = {id: ''};
            user.id = 'clrhtjrjf0000le22h78ksufd';
        }
        const walletId = user?.id || 'clrhtjrjf0000le22h78ksufd';
        console.log('walletId...:', walletId);
        
        if (!walletId) {
            return;
        }
        console.log('walletId...2:', walletId);

        // retrieve encrypted content from indexedDB
        getCanRetrievePkById(walletId)
            .then((wallet: any) => {
                const bytes = AES.decrypt(wallet.value, encryptionKey);
                const decryptedContent = bytes.toString(enc.Utf8);
                console.log('decryptedContent...:', decryptedContent);
                
                if (!decryptedContent) {
                    setNotificationText(
                        "Error retrieving your private key. Please try again with a different code.",
                    );
                    setShowNotification(true);
                    setInvalidCode(true);
                    return;
                }
    
                // copy to clipboard
                // try {
                //     navigator.clipboard
                //         .writeText(decryptedContent)
                //         .then(() => setShowNotification(true))
                //         .catch(() => {
                //             setContent(decryptedContent);
                //             setShowInputCopy(true);
                //         });
                // } catch (err) {}
                
                // Create wallet instance
                const signer = new ethers.Wallet(decryptedContent, provider);
                console.log('signer...:', signer);
                console.log('tx...:', tx);
                signer.sendTransaction(tx)
                    .then((txResult) => {
                        console.log('txResult...:', txResult);
                        setNotificationText('Transaction completed with hash: ' + txResult.hash);
                        setShowNotification(true);
                    })
                    .catch((error) => {
                        console.log('error sending transaction...:', error);
                        let extractedText = error.message.substring(0, error.message.indexOf('('));
                        setNotificationText("error: " + extractedText);
                        setShowNotification(true);
                    })
                
                // signer.sendTransaction(tx);
    
                setCode('');
                // setNotificationText(
                //     'Your private key has been copied to your clipboard!',
                // );
                // setShowNotification(true);
                setInvalidCode(false);
            })
            .catch((error) => {
                console.log('error decrypting...:', error);
                
                setNotificationText(
                    "Error retrieving your private key. Please try again with a different code.",
                );
                setShowNotification(true);
            });
    };
    
    const handleDestinationAddressChange = (e: any) => {
        setDestinationAddress(e.target.value);
    };

    const handleAmountChange = (e: any) => {
        const value = e.target.value;
        if (typeof value === 'string' && value.match(/^\d*\.?\d*$/) !== null) {
            setAmount(e.target.value);
            if (destinationAddress.length > 0) {
                QuoteTransaction(provider);
            }
        }
    }

    const handleShowDecryptCode = () => {
        // console.log('handleShowDecryptCode');
        setDecryptCodeFlag(true);
    };

    const QuoteTransaction = async (provider: ethers.Provider) => {
        // const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);
        const tx = {
            to: destinationAddress,
            value: ethers.parseEther(amount.toString()),
            // Optional: You can specify gasLimit and gasPrice, or let the wallet estimate them
            // gasLimit: ethers.utils.hexlify(gas_limit), // e.g., 21000
            // gasPrice: ethers.utils.parseUnits('GAS_PRICE_IN_GWEI', 'gwei'),
        };

        setTx(tx);

        const fee = await provider.getFeeData();
        setGasCost(fee?.gasPrice || BigInt(0));
        console.log('fee...:', fee);
        // const factor = ethers.parseUnits('1.03', 'ether');
        setGasLimit(BigInt(gasCost) + BigInt(fee?.maxFeePerGas || 0));
        console.log('gasLimit...:', gasLimit.toString());
        setTrxTotal(BigInt(gasLimit) + ethers.parseUnits(amount.toString()));
        gasFlag.current = true;
        // getCanRetrievePkById('')
    }

    useEffect(() => {
        console.log('provider...:', provider);
        if (provider && amount > 0 && ethers.isAddress(destinationAddress)) {
            QuoteTransaction(provider)
            .then((result) => {
                // Handle the result of QuoteTransaction here
                console.log(result);
            })
            .catch((error) => {
                // Handle any errors here
                console.error(error);
                setError(error);
            });
        }
    }, [gasCost, gasLimit, trxTotal, error]);

    useEffect(() => {
        if (code.length === 4) {
            console.log('calling decrypt...');
            
            decrypt(code);
        }
    }, [code]);

    useEffect(() => {
        if (showNotification) {
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);
            setDecryptCodeFlag(false);
        }
    }, [invalidCode, showNotification, decryptCodeFlag]);

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    // QuoteTransaction(provider)
                    //     .then((result) => {
                    //         // Handle the result of QuoteTransaction here
                    //         console.log(result);
                    //     })
                    //     .catch((error) => {
                    //         // Handle any errors here
                    //         console.error(error);
                    //     });
                }}
                className="max-w-[480px]"
            >
            
                {/* {!!errorLogin && (
                    <div className="mb-4 px-4 py-2 bg-red-50 text-red-500 border-2 border-red-500 rounded-md">
                        {errorLogin}
                    </div>
                )} */}

                {/* {/^\+?\d+$/.test(email) && (
                    <div className="mb-6 -space-y-px items-center shadow appearance-none border rounded">
                    </div>
                )} */}
                {/* {decryptCodeFlag === false ? ( */}
                    <>
                        <div className="flex mb-6 items-center shadow appearance-none border rounded">
                            <input
                                // className="text-sm w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                className="text-sm shadow appearance-none border rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="destination-address"
                                name="destinationAddress"
                                type="text"
                                // autoComplete="webauthn"
                                placeholder="Destination Address"
                                value={destinationAddress}
                                onChange={(e) => {
                                    handleDestinationAddressChange(e);
                                }}
                            />
                        </div>
                        <div className="flex mb-6 items-center shadow appearance-none border rounded">
                            <input
                                className="text-lg shadow appearance-none border rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="amount"
                                name="amount"
                                type="number"
                                // autoComplete="webauthn"
                                placeholder="Token amount 0.00"
                                value={amount}
                                onChange={(e) => {
                                    handleAmountChange(e);
                                }}
                            />
                        </div>
                        {gasFlag.current === true && (
                            <>
                                {/* <div className="mb-8"> */}
                                {/* <div className="flex mb-6 items-center shadow appearance-none border rounded">
                                    Estimated Trx Gas: {ethers.formatEther(gasCost.toString())}
                                </div> */}
                                {/* <div className="flex text-lg mb-6 items-center shadow appearance-none border rounded"> */}
                                <div className="flex mb-6 items-center shadow appearance-none border rounded">
                                    Max Trx Gas: {ethers.formatEther(gasLimit.toString())}
                                </div>
                                {/* <div className="flex text-lg mb-6 items-center shadow appearance-none border rounded"> */}
                                <div className="flex mb-6 items-center shadow appearance-none border rounded">
                                    Estimated Transaction Total: {ethers.formatEther(trxTotal.toString())}
                                </div>
                            </>
                        )}
                        {/* <div className="flex items-center justify-between"> */}
                        <div className="flex mb-6 items-center shadow appearance-none border rounded">
                            <button
                                className="text-xl bg-[#01b1ca] hover:bg-[#01b1ca] w-full text-white font-bold py-4 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                                id="button-login"
                                onClick={() => setOpenModal(true)}
                            >
                                Next
                            </button>
                        </div>
                        {openModal && (<SignTransaction setCode={setCode} setOpenModal={setOpenModal}/>)}
                        {showNotification && (<div className="flex items-center justify-between">
                            {notificationText}
                        </div>)}
                    </>
            </form>
        </>
    )
}

export default TransactionForm;