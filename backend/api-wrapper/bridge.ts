export interface BridgeMessage {
  cmd: string;
  payload?: any;
}

export interface BridgeResponse<T> {
  type: string;
  payload?: T;
}

export type Bridge<T> = (message: BridgeMessage) => Promise<BridgeResponse<T>>
