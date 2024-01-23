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
  _network: Networkish
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
