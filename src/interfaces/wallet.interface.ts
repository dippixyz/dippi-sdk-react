export interface Wallet {
    id: string;
    name: string;
    address: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
    walletType: string;
    environment: string;
    privateKey: string;
    recoveryPhrase: string;
    isKeyppiProtected: boolean;
    fileId: string;
}

export interface NFTSImages {
    name: string;
    image: string;
}

export interface WalletAndBalance {
    id: string;
    address: string;
    name: string;
    walletType: string;
    totalUSD: number;
    totalChain: number;
    symbolChain: string;
    nftsImages: NFTSImages[];
    hasFileId: boolean;
}

export interface Media {
    bytes: string;
    format: string;
    gateway: string;
    raw: string;
    uri: string;
    thumbnail: string;
}

export interface Contract {
    address: string;
    tokenType: string;
}

export interface NFTS {
    image: string;
    title: string;
    description: string;
    tokenId: string;
    media: Media[];
    contract: Contract;
    tokenType: string;
    timeLastUpdated: string;
    walletAddress: string;
    tbaAddress: string;
}


export interface ContractInfo {
    address: string;
    name: string;
    symbol: string;
    tokenType: string;
    openSea: {
        lastIngestedAt: string;
    };
    // ... otras propiedades relevantes de 'contract'
}

export interface NFTInfo {
    contract: ContractInfo;
    tokenId: string;
    tokenType: string;
    title: string;
    description: string;
    timeLastUpdated: string;
    metadataError?: string;
    rawMetadata: {
        metadata: any[]; // Puedes ajustar el tipo según los datos reales
        attributes: any[]; // Puedes ajustar el tipo según los datos reales
    };
    tokenUri: {
        gateway: string;
        raw: string;
    };
    media: {
        gateway: string;
        thumbnail: string;
        raw: string;
        format: string;
        bytes: number;
    }[];
    spamInfo?: {
        isSpam: boolean;
        classifications: string[];
    };
    balance: number;
    walletAddress: string;
    tbaAddress: string;
    // ... otras propiedades relevantes de 'nft'
}


export interface TbaInfo {
    address: string;
    title: string;
    tokenId: string;
    format: string;
    gateway: string;
    deployed: boolean;
    tokenContract: string;
    walletOwner: string;
    timeLastUpdated: string;
    description: string;
    contractAddress: string, 
    tokenType: string,
}

interface OwnedNft {
    contract: ContractInfo;
    tokenId: string;
    tokenType: string;
    title: string;
    symbol:string;
    description: string;
    timeLastUpdated: string;
    metadataError: undefined;
    rawMetadata: Record<string, unknown>;
    tokenUri: Record<string, unknown>;
    media: any[]; // Puedes especificar el tipo correcto aquí
    spamInfo: undefined;
    acquiredAt: undefined;
    balance: number;
}

interface Token {
    contractAddress: string;
    rawBalance: string;
    decimals: number;
    logo: string;
    name: string;
    symbol: string;
    balance: string;
}

interface TokenBalance {
    contractAddress: string;
    tokenBalance: string;
}

interface Transfer {
    blockNum: string;
    uniqueId: string;
    hash: string;
    from: string;
    to: string;
    value: null | string;
    erc721TokenId: null | string;
    erc1155Metadata: any[]; // Puedes especificar el tipo correcto aquí
    tokenId: null | string;
    asset: string;
    category: string;
    rawContract: Record<string, unknown>;
}

interface TbaNfts{
    ownedNfts: OwnedNft[];
    blockHash: string;
    totalCount: number;
}

interface Tokens{
    tokens:Token[]
}

interface hexBalance{
    type: string;
    hex: `0x${string}`;
}

export interface TbaBalance {
    balance: hexBalance;
    nfts:OwnedNft[];
    pageKey: undefined;
    totalCount: number;
    blockHash: string;
    tokens: Tokens;
    tokenBalances: TokenBalance[];
    transfers: Transfer[];
}

export interface ParamsCreateWallet {
    userCode: string;
    environment: 'Main Net' | 'Test Net';
};
