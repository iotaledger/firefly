import type { ResponseTypes } from './bridge'
import type { Address } from './address'

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

export interface Event<T> {
  id: number
  type: ResponseTypes
  payload: T
}

export interface ErrorEventPayload {
  type: ErrorType;
  error: string
}

export interface BalanceChangeEventPayload {
  accountId: number[]
  address: Address
  balance: number
}

export interface TransactionEventPayload {
  accountId: number[]
  messageId: number[]
}
