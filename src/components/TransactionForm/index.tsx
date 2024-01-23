import { useState, useRef, useEffect } from 'react';
import { ethers } from 'ethers';
import SignTransaction from '../SignTransaction';
import { useDippiContext } from '../../components/DippiProvider';
import { getCanRetrievePkById } from '../../utils/functions/indexDB';
import { enc, AES } from 'crypto-js';
import { setProvider, ProviderPayload, getCurrency } from '../../utils/functions/providers';
import { transactionDetails, getExplorerUrl } from '../../utils/functions/blockchainTransactions';

export const TransactionForm = (props: ProviderPayload) => {
    const { isConnected, user, address } = useDippiContext();
    const [destinationAddress, setDestinationAddress] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [gasCost, setGasCost] = useState<bigint>(ethers.parseEther('0'));
    const [gasLimit, setGasLimit] = useState<ethers.BigNumberish>(ethers.parseEther('0'));
    const [trxTotal, setTrxTotal] = useState<ethers.BigNumberish>(0);
    const [tx, setTx] = useState<ethers.TransactionRequest>({});
    const [trxDetails, setTrxDetails] = useState<transactionDetails>({
        to: '',
        value: ethers.parseEther('0'),
        gasCost: ethers.parseEther('0'),
        gasLimit: ethers.parseEther('0'),
        trxTotal: ethers.parseEther('0')
    });
    const [error, setError] = useState(null);
    const gasFlag = useRef<boolean>(false);
    const [decryptCodeFlag, setDecryptCodeFlag] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [walletBalance, setWalletBalance] = useState<ethers.BigNumberish>(0);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [notificationText, setNotificationText] = useState<string | JSX.Element>(
        'Your private key has been copied to your clipboard!',
    );
    const [invalidCode, setInvalidCode] = useState<boolean>(false);
    const [isValidAmount, setIsValidAmount] = useState<boolean>(false);

    let provider = setProvider(props);
    
    if (!provider) {
        return null;
    }

    let currency = getCurrency(props._network);

    const decryptAndSign = (code: string) => {
        const encryptionKey = code;

        const walletId = user?.id;
        
        if (!walletId) {
            return;
        }

        // retrieve encrypted content from indexedDB
        getCanRetrievePkById(walletId)
            .then((wallet: any) => {
                const bytes = AES.decrypt(wallet.value, encryptionKey);
                const decryptedContent = bytes.toString(enc.Utf8);
                
                if (!decryptedContent) {
                    setNotificationText(
                        "Error retrieving your private key. Please try again with a different code.",
                    );
                    setShowNotification(true);
                    setInvalidCode(true);
                    return;
                }
                
                // Create wallet instance
                const signer = new ethers.Wallet(decryptedContent, provider);

                signer.sendTransaction(tx)
                    .then((txResult) => {
                        provider.getNetwork().then((network: ethers.Network) => {
                            const txUrl = getExplorerUrl(parseInt(network.chainId.toString()), txResult.hash);
                            const txLink = <a href={txUrl} target="_blank" rel="noopener noreferrer" className="text-red-500 overflow-auto whitespace-normal">{'Transaction completed with hash: ' + txResult.hash}</a>;
                            setNotificationText(txLink);
                            setShowNotification(true);
                        });
                    })
                    .catch((error) => {
                        let extractedText = error.message.substring(0, error.message.indexOf('('));
                        setNotificationText("error: " + extractedText);
                        setShowNotification(true);
                    })
                setCode('');
                setInvalidCode(false);
            })
            .catch((error) => {
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
        }
    }

    const handleNextScreen = () => {
        
        if (!isConnected) {
            setNotificationText(
                "Please connect your wallet to continue.",
            );
            setShowNotification(true);
            return;
        }
        if (ethers.isAddress(destinationAddress) && amount > 0) {
            setOpenModal(true);
        } else {
            setNotificationText(
                "Please enter a valid destination address and amount.",
            );
            setShowNotification(true);
        }
    };

    const quoteTransaction = async (provider: ethers.Provider) => {
        try {
            const tx = {
                to: destinationAddress,
                value: ethers.parseEther(amount.toString()),
            };
    
            setTx(tx);
    
            const fee = await provider.getFeeData();

            setGasCost(fee?.gasPrice || BigInt(0));
            setGasLimit(fee?.maxFeePerGas || BigInt(0));
            setTrxTotal(BigInt(gasLimit) + ethers.parseEther(amount.toString()));
            
            gasFlag.current = true;

            setTrxDetails({
                to: destinationAddress,
                value: ethers.parseEther(amount.toString()),
                gasCost: gasCost,
                gasLimit: gasLimit,
                trxTotal: trxTotal
            });
        } catch (error) {
            console.log('fix your params...');
        }
    }

    useEffect(() => {
        if (provider && amount > 0 && ethers.isAddress(destinationAddress)) {
            quoteTransaction(provider)
            .then(() => {
                setError(null);
            })
            .catch((error: any) => {
                setError(error);
            });
        }
    }, [amount, gasCost, gasLimit, trxTotal, error]);

    useEffect(() => {
        if (code.length === 4) {
            decryptAndSign(code);
        }
    }, [code]);

    useEffect(() => {
        if (showNotification) {
            setTimeout(() => {
                setShowNotification(false);
            }, 6000);
            setDecryptCodeFlag(false);
        }
    }, [invalidCode, showNotification, decryptCodeFlag]);

    useEffect(() => {
        if (address) {
            provider.getBalance(address).then((balance) => {
                setWalletBalance(balance);
            });
        }   
    }
    , [address]);

    useEffect(() => {
        const walletBalanceNumber = parseFloat(ethers.formatEther(walletBalance.toString()));
        if (amount > 0 && amount <= walletBalanceNumber) {
            setIsValidAmount(true);
        } else {
            setIsValidAmount(false);
        }
    }, [amount, walletBalance]);

    return (
        <>
            <div className="bg-white rounded-lg p-8 mx-auto my-10 w-full max-w-[400px]">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                    // className="max-w-[640px]"
                >
                    <>
                        <h2 className="text-2xl text-gray-700 font-bold mb-4">Send Transaction</h2>
                        <label htmlFor="from-address" className="mb-2 text-sm font-bold text-gray-700">From</label>
                        <div className="flex mb-6 items-center shadow appearance-none border rounded">
                            <input
                                className="text-xs shadow appearance-none border rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="from-address"
                                name="fromAddress"
                                type="text"
                                placeholder="0x000000000000000000000000000000000000000"
                                value={address}
                                size={72}
                                disabled={true}
                            />
                        </div>
                        <div className="text-sm text-gray-700 flex mb-6 items-center appearance-none rounded">
                            <p><strong>Balance: </strong>{ethers.formatEther(walletBalance.toString())}</p>
                        </div>
                        <label htmlFor="destination-address" className="mb-2 text-sm font-bold text-gray-700">Destination Address</label>
                        <div className="flex mb-6 items-center shadow appearance-none border rounded">
                            <input
                                className="text-xs shadow appearance-none border rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="destination-address"
                                name="destinationAddress"
                                type="text"
                                placeholder="0x000000000000000000000000000000000000000"
                                value={destinationAddress}
                                size={72}
                                onChange={(e) => {
                                    handleDestinationAddressChange(e);
                                }}
                            />
                        </div>
                        <div className="flex mb-6 items-center shadow appearance-none border rounded">
                            <label htmlFor="amount" className="p-2 mb-2 text-base font-bold text-gray-500">{currency+" "}</label>
                            <input
                                className={`text-sm shadow appearance-none border rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${isValidAmount ? 'border-green-500' : 'border-red-500'}`}
                                id="amount"
                                name="amount"
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => {
                                    handleAmountChange(e);
                                }}
                                onWheel={(e) => {
                                    e.preventDefault();
                                }}
                            />
                        </div>
                        {gasFlag.current === true && (
                            <>
                                <div className="text-sm text-gray-700 flex mb-6 items-center appearance-none rounded">
                                    <p><strong>Max Gas: </strong>{ethers.formatEther(gasLimit.toString())}</p>
                                </div>
                                <div className="text-sm text-gray-700 flex mb-6 items-center appearance-none rounded">
                                    <p><strong>Estimated Total: </strong>{ethers.formatEther(trxTotal.toString())}</p>
                                </div>
                            </>
                        )}
                        <div className="flex mb-6 items-center shadow appearance-none border rounded">
                            <button
                                className="text-xl bg-[#01b1ca] hover:bg-[#01b1ca] w-full text-white font-bold py-4 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                                id="button-login"
                                onClick={() => handleNextScreen()}
                                disabled={!isValidAmount}
                            >
                                Next
                            </button>
                        </div>
                        {openModal && (<SignTransaction setCode={setCode} setOpenModal={setOpenModal} tx={trxDetails}/>)}
                        {showNotification && (<div className="text-sm text-red-700 flex mb-6 items-center appearance-none rounded">
                            {notificationText}
                        </div>)}
                    </>
                </form>
            </div>
        </>
    )
}

export default TransactionForm;