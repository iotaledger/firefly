export interface BridgeMessage {
  cmd: string;
  payload: any;
}

export type Bridge = (message: BridgeMessage) => Promise<any>
