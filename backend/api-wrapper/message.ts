import { Bridge } from './bridge'
import { AccountIdentifier } from './account'

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

export enum MessageType {
  /// Message received.
  Received,
  /// Message sent.
  Sent,
  /// Message not broadcasted.
  Failed,
  /// Message not confirmed.
  Unconfirmed,
  /// A value message.
  Value,
}


export interface ListMessageFilter {
  messageType?: MessageType;
}

export function listMessages(bridge: Bridge, accountId: AccountIdentifier, filter: ListMessageFilter, count: number, from = 0): Promise<Message[]> {
  return bridge({
    cmd: 'ListMessages',
    payload: {
      accountId,
      messageType: filter.messageType,
      count,
      from
    }
  })
}

export function reattach(bridge: Bridge, accountId: AccountIdentifier, messageHash: string) {
  return bridge({
    cmd: 'Reattach',
    payload: {
      accountId,
      messageHash
    }
  })
}
