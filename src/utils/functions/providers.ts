import {
    AlchemyProvider,
    AnkrProvider,
    CloudflareProvider,
    EtherscanProvider,
    InfuraProvider,
    PocketProvider,
    QuickNodeProvider
 } from 'ethers';

import type { Networkish } from 'ethers';

export type ProviderType = 'Alchemy' | 'Ankr' | 'Cloudflare' | 'Etherscan' | 'Infura' | 'Pocket' | 'QuickNode';

export interface ProviderPayload {
    provider: ProviderType;
    _network?: Networkish;
    applicationId?: string;
    projectId?: string;
    apiKey?: string;
    _apiKey?: string;
    projectSecret?: string;
    applicationSecret?: string;
 }

export const setProvider = (provider: ProviderPayload) => {
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