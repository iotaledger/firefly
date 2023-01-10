import type { INodeInfo, IRent } from '@iota/types';

/** Network types */
export enum Network {
    Mainnet,
    Testnet,
}

/** Basic Auth or JWT */
export type Auth = {
    jwt?: string;
    username?: string;
    password?: string;
};

/** Information about the network and client */
export interface NetworkInfo {
    network?: string;
    networkId?: number;
    bech32Hrp?: string;
    minPowScore?: number;
    localPow?: boolean;
    fallbackToLocalPow?: boolean;
    tipsInterval?: number;
    rentStructure?: IRent;
}

/** A node object for the client */
export type Node = {
    url: string;
    auth?: Auth;
    disabled?: boolean;
};

/** Options for the client builder */
export interface ClientOptions {
    apiTimeout?: number;
    automaticDisconnect?: boolean;
    fallbackToLocalPow?: boolean;
    localPow?: boolean;
    maxReconnectionAttempts?: number;
    minQuorumSize?: number;
    network?: string;
    networkInfo?: NetworkInfo;
    nodes?: Array<string | Node>;
    nodeSyncEnabled?: boolean;
    nodeSyncInterval?: number;
    permanodes?: Array<string | Node>;
    port?: number;
    powWorkerCount?: number;
    primaryNode?: string | Node;
    primaryPowNode?: string | Node;
    quorum?: boolean;
    quorumThreshold?: boolean;
    remotePowTimeout?: number;
    // timeout in seconds
    timeout?: number;
    useWs?: boolean;
}

/**
 * NodeInfo wrapper which contains the node info and the url from the node (useful when multiple nodes are used)
 */
export interface NodeInfoWrapper {
    /** The returned node info */
    nodeInfo: INodeInfo;
    /** The url from the node which returned the node info */
    url: string;
}
