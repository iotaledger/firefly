import type { Bridge, CommunicationIds } from './bridge'
import type { AccountIdentifier } from './account'

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

export interface Transfer {
  amount: number
  address: string
}

export function reattach(bridge: Bridge, __ids: CommunicationIds, accountId: AccountIdentifier, messageId: string) {
  return bridge({
    actorId: __ids.actorId,
    id: __ids.messageId,
    cmd: 'Reattach',
    payload: {
      accountId,
      messageId
    }
  })
}
