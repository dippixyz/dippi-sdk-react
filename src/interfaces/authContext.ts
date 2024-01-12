// import { AuthenticationResponseJSON } from '@simplewebauthn/typescript-types';
import { ReactNode } from 'react';

export interface SignInConnectWalletPayloadType {
    address: string;
    walletType: string;
    topic: string;
}

export interface SignUpPayloadType {
    email: string;
    password: string;
    acceptTermsAndConditions: boolean;
    referralCode?: string;
}

export interface SignInPayloadType {
    email: string;
    password: string;
    countryCode?: string;
}

export interface PasskeySignInPayloadType {
    // authentication: AuthenticationResponseJSON;
    authentication: "";
    email: string;
    id: string;
}

export interface DippiProviderProps {
    children: ReactNode;
    config: {
      appToken: string;
      appId: string;
      url: string;
    };
}

export type User = {
    email: string;
    password: string;
};