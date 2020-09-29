export interface UnsignedTransaction {
  inputs: Input[];
  outputs: Output[];
  payload?: Payload[];
}

export interface Input {
  transactionId: string
  outputIndex: number
}

export interface Output {
  address: string
  amount: number
}

export interface SignedTransaction {
  unsignedTransaction: UnsignedTransaction;
}

export type Payload = SignedTransaction;

export interface Message {
  version: number;
  trunk: string;
  branch: string;
  payload_length: number;
  payload: Payload;
  timestamp: string;
  nonce: number;
  confirmed: boolean;
  broadcasted: boolean;
}
