import {
  AlchemyProvider,
  AnkrProvider,
  CloudflareProvider,
  EtherscanProvider,
  InfuraProvider,
  PocketProvider,
  QuickNodeProvider
} from 'ethers'

import type { Networkish } from 'ethers'

export type ProviderType =
  | 'Alchemy'
  | 'Ankr'
  | 'Cloudflare'
  | 'Etherscan'
  | 'Infura'
  | 'Pocket'
  | 'QuickNode'

export interface BaseProps {
  _network: Networkish;
  currency: string;
}

export interface AlchemyProviderPayload extends BaseProps {
    provider: 'Alchemy';
    apiKey: string;
}

export interface AnkrProviderPayload extends BaseProps {
    provider: 'Ankr';
    apiKey: string;
}

export interface CloudflareProviderPayload extends BaseProps {
    provider: 'Cloudflare';
}

export interface EtherscanProviderPayload extends BaseProps {
    provider: 'Etherscan';
    _apiKey: string;
}

export interface InfuraProviderPayload extends BaseProps {
    provider: 'Infura';
    projectId: string;
    projectSecret: string;
}

export interface PocketProviderPayload extends BaseProps {
    provider: 'Pocket';
    applicationId: string;
    applicationSecret: string;
}

export interface QuickNodeProviderPayload extends BaseProps {
    provider: 'QuickNode';
    token: string;
}

export type ProviderPayload =
  | AlchemyProviderPayload
  | AnkrProviderPayload
  | CloudflareProviderPayload
  | EtherscanProviderPayload
  | InfuraProviderPayload
  | PocketProviderPayload
  | QuickNodeProviderPayload

const networkToCurrencyMap: Record<string | number, string> = {
    "mainnet": "ETH",
    1: "ETH",
    "ropsten": "ETH",
    3: "ETH",
    "rinkeby": "ETH",
    4: "ETH",
    "goerli": "ETH",
    5: "ETH",
    "kovan": "ETH",
    42: "ETH",
    "sepolia": "ETH",
    11155111: "ETH",
    "classic": "ETC",
    61: "ETC",
    "classicKotti": "ETC",
    6: "ETC",
    "maticMumbai": "MATIC",
    80001: "MATIC",
    "optimism": "ETH",
    10: "ETH",
    "optimism-goerli": "ETH",
    420: "ETH",
    "xdai": "STAKE",
    100: "STAKE",
    // Added other networks
    "arbitrum": "ETH",
    42161: "ETH",
    "arbitrum-goerli": "ETH",
    421613: "ETH",
    "base": "BASE",
    8453: "BASE",
    "base-goerli": "BASE",
    84531: "BASE",
    "base-sepolia": "BASE",
    84532: "BASE",
    "bnb": "BNB",
    56: "BNB",
    "bnbt": "BNBT",
    97: "BNBT",
    "linea": "LINEA",
    59144: "LINEA",
    "linea-goerli": "LINEA",
    59140: "LINEA",
    "matic": "MATIC",
    137: "MATIC"
};

export const setProvider = (provider: ProviderPayload) => {
    switch (provider.provider) {
        case 'Alchemy':
            const alchemyParams: AlchemyProviderPayload = provider as AlchemyProviderPayload;
            return new AlchemyProvider(alchemyParams._network, alchemyParams.apiKey);
        case 'Ankr':
            const ankrParams: AnkrProviderPayload = provider as AnkrProviderPayload;
            return new AnkrProvider(ankrParams._network, ankrParams.apiKey);
        case 'Cloudflare':
            const cloudflareParams: BaseProps = provider as BaseProps;
            return new CloudflareProvider(cloudflareParams._network);
        case 'Etherscan':
            const etherscanParams: EtherscanProviderPayload = provider as EtherscanProviderPayload;
            return new EtherscanProvider(etherscanParams._network, etherscanParams._apiKey);
        case 'Infura':
            const infuraParams: InfuraProviderPayload = provider as InfuraProviderPayload;
            return new InfuraProvider(infuraParams._network, infuraParams.projectId, infuraParams.projectSecret);
        case 'Pocket':
            const pocketParams: PocketProviderPayload = provider as PocketProviderPayload;
            return new PocketProvider(pocketParams._network, pocketParams.applicationId, pocketParams.applicationSecret);
        case 'QuickNode':
            const quickNodeParams: QuickNodeProviderPayload = provider as QuickNodeProviderPayload;
            return new QuickNodeProvider(quickNodeParams._network, quickNodeParams.token);
    }
}

export const getCurrency = (network: Networkish): string => {
    if (typeof network === "string" || typeof network === "number") 
        return networkToCurrencyMap[network];
    else {
        return "";
    }
};
