import type { Address } from './address'
import type { Message } from './message'

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
  accountId: string
  address: Address
  balance: number
}

export interface TransactionEvent {
  accountId: string
  message: Message
}
