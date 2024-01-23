import { BigNumberish } from 'ethers';

export interface transactionDetails {
    to: string;
    value: BigNumberish;
    gasCost: BigNumberish;
    gasLimit: BigNumberish;
    trxTotal: BigNumberish;
};

export function getExplorerUrl(chain: string | number, txHash: string): string {
    let baseUrl: string;

    switch (chain) {
        case 1:
        case "mainnet":
            baseUrl = 'https://etherscan.io/tx/';
            break;
        case 3:
        case "ropsten":
            baseUrl = 'https://ropsten.etherscan.io/tx/';
            break;
        case 4:
        case "rinkeby":
            baseUrl = 'https://rinkeby.etherscan.io/tx/';
            break;
        case 5:
        case "goerli":
            baseUrl = 'https://goerli.etherscan.io/tx/';
            break;
        case 42:
        case "kovan":
            baseUrl = 'https://kovan.etherscan.io/tx/';
            break;
        case 56:
        case "bsc":
            baseUrl = 'https://bscscan.com/tx/';
            break;
        case 137:
        case "polygon":
            baseUrl = 'https://polygonscan.com/tx/';
            break;
        case 100:
        case "xdai":
            baseUrl = 'https://blockscout.com/poa/xdai/tx/';
            break;
        case 250:
        case "fantom":
            baseUrl = 'https://ftmscan.com/tx/';
            break;
        case 43114:
        case "avalanche":
            baseUrl = 'https://cchain.explorer.avax.network/tx/';
            break;
        case 80001:
        case "mumbai":
            baseUrl = 'https://mumbai.polygonscan.com/tx/';
            break;
        default:
            throw new Error(`Unsupported chain: ${chain}`);
    }

    return baseUrl + txHash;
}