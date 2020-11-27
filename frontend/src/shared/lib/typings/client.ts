export enum Network {
  Mainnet,
  Devnet,
  Comnet
}

export interface ClientOptions {
  node?: string;
  nodes?: string[];
  network?: Network;
  quorumSize?: number;
  quorumThreshold?: number;
}
