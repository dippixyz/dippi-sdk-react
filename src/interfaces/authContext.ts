import { AuthenticationResponseJSON } from '@simplewebauthn/typescript-types';

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
    authentication: AuthenticationResponseJSON;
    email: string;
    id: string;
}