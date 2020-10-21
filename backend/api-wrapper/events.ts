import { Address } from './address'

export enum ErrorType {
  UnknownError,
  GenericError,
  IoError,
  JsonError,
  StrongholdError,
  ClientError,
  SqliteError,
  UrlError,
  UnexpectedResponse,
  MessageAboveMaxDepth,
  MessageAlreadyConfirmed,
  MessageNotFound,
  EmptyNodeList,
  InvalidAddressLength,
  InvalidTransactionIdLength,
  InvalidMessageIdLength,
  Bech32Error,
  AccountAlreadyImported,
  StorageDoesntExist,
  InsufficientFunds,
  MessageNotEmpty,
  LatestAccountIsEmpty,
  ZeroAmount,
}

export type Callback<T> = (error: string, data: T) => void

export interface Emitter {
  new(eventName: string): Emitter
  poll: (cb: (err: string, data: string) => void) => void
}

export interface ErrorEvent {
  type: ErrorType
  error: string
}

export interface BalanceChangeEvent {
  accountId: number[]
  address: Address
  balance: number
}

export interface TransactionEvent {
  accountId: number[]
  messageId: number[]
}

function _poll(emitter: Emitter, cb: (error: string, data: any) => void) {
  emitter.poll((err: string, data: string) => {
    cb(err, err ? null : JSON.parse(data))
    _poll(emitter, cb)
  })
}

export function onError(EventEmitter: Emitter, cb: Callback<ErrorEvent>) {
  _poll(new EventEmitter('Error'), cb)
}

export function onBalanceChange(EventEmitter: Emitter, cb: Callback<BalanceChangeEvent>) {
  _poll(new EventEmitter('BalanceChange'), cb)
}

export function onNewTransaction(EventEmitter: Emitter, cb: Callback<TransactionEvent>) {
  _poll(new EventEmitter('NewTransaction'), cb)
}

export function onConfirmationStateChange(EventEmitter: Emitter, cb: Callback<TransactionEvent>) {
  _poll(new EventEmitter('ConfirmationStateChange'), cb)
}

export function onReattachment(EventEmitter: Emitter, cb: Callback<TransactionEvent>) {
  _poll(new EventEmitter('Reattachment'), cb)
}

export function onBroadcast(EventEmitter: Emitter, cb: Callback<TransactionEvent>) {
  _poll(new EventEmitter('Broadcast'), cb)
}
