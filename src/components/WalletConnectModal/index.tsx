import React, { useEffect, useState } from 'react';
import { useDippiContext } from '../DippiProvider';
// import { useRouter } from 'next/router';
import { ConnectKitButton } from 'connectkit';
import { useAccount } from 'wagmi';
import { AES } from 'crypto-js';

interface props {
    handleShowMessage: () => void;
    setShow: (value: boolean) => void;
}

export const ModalWalletConnect = ({ handleShowMessage, setShow }: props) => {
    const { handleConnectWallet } = useDippiContext();
    const [disabled, setDisabled] = useState(false);
    // const router = useRouter();
    const { address, connector } = useAccount();

    const handleConnectionSuccess = async () => {
        console.log('init handleConnectionSuccess...');

        if (!address) {
            return;
        }

        const topic = AES.encrypt(address, address).toString();

        const tokenPair = await handleConnectWallet({
            walletType: 'Polygon',
            address,
            topic: topic,
        });

        const { accessToken, refreshToken } = tokenPair;

        if (
            accessToken &&
            refreshToken &&
            accessToken.trim() !== '' &&
            refreshToken.trim() !== ''
        ) {
            if (document) {
                const modalcss = document.querySelector('.wcm-active');
                if (modalcss) {
                    modalcss.classList.remove('wcm-active');
                    modalcss.classList.add('wcm-inactive');
                }
            }
            
        }
    };

    useEffect(() => {
        if (connector && address) {
            setDisabled(true);
            handleConnectionSuccess();

            handleShowMessage();
            setShow(true);
        } else {
            setDisabled(false);
        }
    }, [connector]);

    return (
        <div>
            <ConnectKitButton.Custom>
                {({ isConnected, show }) => {
                    return (
                        <button
                            type="button"
                            className="button-verified  justify-center text-black focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                            id="my-connect-wallet-button"
                            style={{
                                backgroundColor: '#FFC9FF',
                                color: 'black',
                            }}
                            disabled={disabled}
                            onClick={show}
                        >
                            {isConnected ? address : 'Connect Wallet'}
                        </button>
                    );
                }}
            </ConnectKitButton.Custom>
        </div>
    );
};
