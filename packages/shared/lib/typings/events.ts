import type { ResponseTypes } from './bridge'
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

export interface Event<T> {
  action: string
  id: string
  type: ResponseTypes
  payload: T
}

export interface ErrorEventPayload {
  type: ErrorType;
  error: string
}

export interface BalanceChangeEventPayload {
  accountId: string
  address: Address
  balance: number
}

export interface TransactionEventPayload {
  accountId: string
  message: Message
}
