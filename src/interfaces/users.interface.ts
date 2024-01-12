import { Wallet } from './wallet.interface';

export interface User {
    id: string;
    email: string;
    password: string;
    username: string;
    createdAt: Date;
    applicationId: string;
    lastLogin?: Date;
    isActive: boolean;
    referralCode: string;
    referrerId: string;
    dipTokenBalance: number;
    dipInitMineTime: Date;
    currentChallenge: string;
    singupState: string;
    isVerified: boolean;
    wallets: Wallet[];
}

export interface UserDippiResponseBody {
    id: string;
    password: string;
    name: string;
    email: string;
    phone: string;
    isVerified: boolean;
    isActive: boolean;
    referralCode: string;
    referrerId: string;
    dipTokenBalance: number;
    dipInitMineTime: Date;
    dipInitMineAmount: number;
    dipInitReferredCount: number;
    currentChallenge: string;
    singupState: string;
    applicationId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ConfirmEmailProps {
    success: boolean;
} 