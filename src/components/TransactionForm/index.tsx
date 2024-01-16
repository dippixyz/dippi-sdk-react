import { useState, useRef, useEffect } from 'react';
import {
    ethers,
    AlchemyProvider,
    AnkrProvider,
    CloudflareProvider,
    EtherscanProvider,
    InfuraProvider,
    PocketProvider,
    QuickNodeProvider
 } from 'ethers';
 import type { Networkish } from 'ethers';

//  export enum ProviderType {
//     'Alchemy',
//     'Ankr',
//     'Cloudflare',
//     'Etherscan',
//     'Infura',
//     'Pocket',
//     'QuickNode'
//  }
type ProviderType = 'Alchemy' | 'Ankr' | 'Cloudflare' | 'Etherscan' | 'Infura' | 'Pocket' | 'QuickNode';

 interface TransactionFormProps {
    provider: ProviderType;
    _network?: Networkish;
    applicationId?: string;
    projectId?: string;
    apiKey?: string;
    _apiKey?: string;
    projectSecret?: string;
    applicationSecret?: string;

    // privateKey: string;
    // to: string;
    // value: number;
    // gasLimit: number;
    // gasPrice: number;
    // nonce: number;
    // data: string;
 }

const setProvider = (provider: TransactionFormProps) => {
    const apiKey = provider.apiKey || provider._apiKey || provider.projectSecret || provider.applicationSecret;
    const applicationId = provider.applicationId || provider.projectId;
    console.log('props...:', provider);
    console.log('apiKey...:', apiKey);
    console.log('applicationId...:', applicationId);
    
    switch (provider.provider) {
        case "Alchemy":
            console.log('Alchemy provider');
            return new AlchemyProvider(provider._network, apiKey);
        case "Ankr":
            console.log('Ankr provider');
            return new AnkrProvider(provider._network, apiKey);
        case "Cloudflare":
            console.log('Cloudflare provider');
            return new CloudflareProvider(provider._network);
        case "Etherscan":
            console.log('Etherscan provider');
            return new EtherscanProvider(provider._network, apiKey);
        case "Infura":
            console.log('Infura provider');
            return new InfuraProvider(provider._network, applicationId, apiKey);
        case "Pocket":
            console.log('Pocket provider');
            return new PocketProvider(provider._network, applicationId, apiKey);
        case "QuickNode":
            console.log('QuickNode provider');
            return new QuickNodeProvider(provider._network, apiKey);
        default:
            console.log('provider not found', provider.provider, typeof provider.provider);
            return new AlchemyProvider(provider._network, apiKey);
    }
}

export const TransactionForm = (props: TransactionFormProps) => {
    const [destinationAddress, setDestinationAddress] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [gasCost, setGasCost] = useState<bigint>(ethers.parseEther('0'));
    // const gasCost = useRef<ethers.BigNumberish>(ethers.parseEther('0'));
    const [gasLimit, setGasLimit] = useState<ethers.BigNumberish>(ethers.parseEther('0'));
    // const gasLimit = useRef<ethers.BigNumberish>(ethers.parseEther('0'));
    // const trxTotal = useRef<ethers.BigNumberish>(ethers.parseEther('0'));
    const [trxTotal, setTrxTotal] = useState<ethers.BigNumberish>(0);
    const [error, setError] = useState(null);
    const gasFlag = useRef<boolean>(false);
    let provider = setProvider(props);
    console.log('provider...:', provider);
    

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
        // const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);
        const tx = {
            to: destinationAddress,
            value: ethers.parseEther(amount.toString()),
            // Optional: You can specify gasLimit and gasPrice, or let the wallet estimate them
            // gasLimit: ethers.utils.hexlify(gas_limit), // e.g., 21000
            // gasPrice: ethers.utils.parseUnits('GAS_PRICE_IN_GWEI', 'gwei'),
        };
        // wallet.populateTransaction(tx)
        // const transaction = await wallet.prepareTransaction(tx);
        // console.log('transaction >>>>>>>>>>>', transaction);
        // gasCost.current = await provider.estimateGas(tx);
        setGasCost(await provider.estimateGas(tx));
        const factor = ethers.parseUnits('1.03', 'ether');
        // gasLimit.current = gasCost.current * factor;
        setGasLimit(gasCost);
        console.log('gasLimit...:', gasLimit.toString());
        // trxTotal.current = gasLimit.current + ethers.parseEther(amount.toString());
        setTrxTotal(gasCost + (ethers.parseUnits(amount.toString())));
        gasFlag.current = true;
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
                className="max-w-[320px]"
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
                <div className="flex mb-6 items-center shadow appearance-none border rounded">
                    <input
                        className="text-xl w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                <div className="mb-8">
                    <input
                        className="text-xl shadow appearance-none border rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                        <div className="mb-8">
                            Estimated Trx Gas: {ethers.formatEther(gasCost.toString())}
                            {/* <input
                                className="text-xl shadow appearance-none border rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="gas-cost"
                                name="gasCost"
                                type="text"
                                // autoComplete="webauthn"
                                placeholder="0.00"
                                readOnly
                                value={ethers.formatEther(gasCost.toString())}
                                // onChange={(e) => setAmount(parseFloat(e.target.value))}
                            /> */}
                        </div>
                        <div className="mb-8">
                            Transaction Total: {ethers.formatEther(trxTotal.toString())}
                            {/* <input
                                className="text-xl shadow appearance-none border rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="trx-total"
                                name="trxTotal"
                                type="number"
                                // autoComplete="webauthn"
                                placeholder="0.00"
                                readOnly
                                value={ethers.formatEther(trxTotal.toString())}
                                // onChange={(e) => setAmount(parseFloat(e.target.value))}
                            /> */}
                        </div>
                    </>
                )}
                <div className="flex items-center justify-between">
                    <button
                        className="text-xl bg-[#01b1ca] hover:bg-[#01b1ca] w-full text-white font-bold py-4 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                        id="button-login"
                    >
                        Next
                    </button>
                </div>
            </form>
        </>
    )
}

export default TransactionForm;