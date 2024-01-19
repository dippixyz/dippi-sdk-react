import { useState, useRef, useEffect } from 'react';
import { ethers } from 'ethers';
import SignTransaction from '../SignTransaction';
import { useDippiContext } from '../../components/DippiProvider';
import { getCanRetrievePkById } from '../../utils/functions/indexDB';
import { enc, AES } from 'crypto-js';
import { setProvider, ProviderPayload } from '../../utils/functions/providers';
import { transactionDetails, getExplorerUrl } from '../../utils/functions/blockchainTransactions';

export const TransactionForm = (props: ProviderPayload) => {
    const { signUpStatus, address, isConnected, user } = useDippiContext();
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
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [notificationText, setNotificationText] = useState<string | JSX.Element>(
        'Your private key has been copied to your clipboard!',
    );
    const [invalidCode, setInvalidCode] = useState<boolean>(false);
    const [showInputCopy, setShowInputCopy] = useState<boolean>(false);
    const [content, setContent] = useState<string>('');

    let provider = setProvider(props);

    const decryptAndSign = (code: string) => {
        const encryptionKey = code;

        if (user && !user?.id) {
            user.id = 'clrhtjrjf0000le22h78ksufd';
        }
        const walletId = user?.id || 'clrhtjrjf0000le22h78ksufd';
        
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
                        console.log('txResult...:', txResult);
                        provider.getNetwork().then((network: ethers.Network) => {
                            console.log('chainId...:', network.chainId);
                            const txUrl = getExplorerUrl(parseInt(network.chainId.toString()), txResult.hash);
                            const txLink = <a href={txUrl} target="_blank" rel="noopener noreferrer">{'Transaction completed with hash: ' + txResult.hash}</a>;
                            setNotificationText(txLink);
                            setShowNotification(true);
                        });
                    })
                    .catch((error) => {
                        console.log('error sending transaction...:', error);
                        let extractedText = error.message.substring(0, error.message.indexOf('('));
                        setNotificationText("error: " + extractedText);
                        setShowNotification(true);
                    })
                setCode('');
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

    const QuoteTransaction = async (provider: ethers.Provider) => {
        const tx = {
            to: destinationAddress,
            value: ethers.parseEther(amount.toString()),
        };

        setTx(tx);

        const fee = await provider.getFeeData();
        setGasCost(fee?.gasPrice || BigInt(0));
        setGasLimit(BigInt(gasCost) + BigInt(fee?.maxFeePerGas || 0));
        setTrxTotal(BigInt(gasLimit) + ethers.parseUnits(amount.toString()));
        gasFlag.current = true;
        setTrxDetails({
            to: destinationAddress,
            value: ethers.parseEther(amount.toString()),
            gasCost: gasCost,
            gasLimit: gasLimit,
            trxTotal: trxTotal
        });
    }

    useEffect(() => {
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

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                }}
                className="max-w-[480px]"
            >
                <>
                    <div className="flex mb-6 items-center shadow appearance-none border rounded">
                        <input
                            className="text-sm shadow appearance-none border rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="destination-address"
                            name="destinationAddress"
                            type="text"
                            placeholder="Destination Address"
                            value={destinationAddress}
                            size={48}
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
                            placeholder="Token amount 0.00"
                            value={amount}
                            onChange={(e) => {
                                handleAmountChange(e);
                            }}
                        />
                    </div>
                    {gasFlag.current === true && (
                        <>
                            <div className="text-sm flex mb-6 items-center shadow appearance-none rounded">
                                <p><strong>Max Gas: </strong>{ethers.formatEther(gasLimit.toString())}</p>
                            </div>
                            <div className="text-sm flex mb-6 items-center shadow appearance-none rounded">
                                <p><strong>Estimated Total: </strong>{ethers.formatEther(trxTotal.toString())}</p>
                            </div>
                        </>
                    )}
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
                    {openModal && (<SignTransaction setCode={setCode} setOpenModal={setOpenModal} tx={trxDetails}/>)}
                    {showNotification && (<div className="text-sm flex mb-6 items-center shadow appearance-none rounded">
                        {notificationText}
                    </div>)}
                </>
            </form>
        </>
    )
}

export default TransactionForm;