export interface NodeAuth {
    jwt?: string,
    username?: string,
    password?: string
}

export interface Node {
    url: string
    auth?: NodeAuth
    disabled?: boolean
}

export interface NodeInfo {
    nodeinfo: {
        name: string;
        version: string;
        isHealthy: boolean;
        networkId: string;
        minPoWScore: number;
        bech32HRP: string;
        latestMilestoneIndex: number;
        latestMilestoneTimestamp: number;
        confirmedMilestoneIndex: number;
        pruningIndex: number;
        features: string[];
        messagesPerSecond: number;
        referencedMessagesPerSecond: number;
        referencedRate: number;
    }
    url: string
}
