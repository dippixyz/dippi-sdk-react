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

export interface ConfirmEmailProps {
    success: boolean;
} 