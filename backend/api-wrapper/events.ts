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
