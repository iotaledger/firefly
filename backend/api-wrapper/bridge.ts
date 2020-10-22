export interface BridgeMessage {
  cmd: string;
  payload?: any;
}

export interface BridgeResponse<T> {
  type: string;
  payload?: T;
}

export type Bridge = (message: BridgeMessage) => Promise<void>
