export interface Msg { 
    id?: string // id MAY be included when forwarding msg
    cmd: Cmd
    payload: Payload
    origin?: string
    from?: string
}

export type Cmd = 
    'GetAccounts' |
    'CallAccountMethod' |
    'GetAccount' |
    'SendTransfer' |
    'CallGlow' 

export interface Response {
    type: ResponseType
    payload: Payload
}

export type ResponseType = 
    'Error' |
    'SentTransfer' | 
    'Balance' |
    'CalledGlow' |
    'ReadAccount' |
    'ReadAccounts' |
    'Balance' |
    'TotalBalance' |
    'Addresses' |
    'GeneratedAddress' |
    'LatestAddress' |
    'SyncedAccount' |

    'Started' |
    'LinkedProfile' | 
    'GotOrigins' | 
    'AddedOrigin' |
    'RemovedOrigin' |
    'UpdatedOrigin' |
    'GotAuthorizedAccounts' |
    'GotProfile' |
    'Cancelled'

export type Payload = string | AccountMethodPayload | SendTransferPayload | AccountBalance | CallGlowPayload | any

export type AccountMethodName = 
    'GenerateAddress' |
    'ListMessages' | 
    'ListAddresses' |
    'GetBalance' | 
    'GetLatestAddress' | 
    'SyncAccount'

export type GlowMethodName = 
    'LinkProfile' |
    'CheckLink' |
    'AddOrigin' | 
    'GetOrigins' |
    'RemoveOrigin' |
    'UpdateOrigin' |
    'GetAuthorizedAccounts' |
    'GetProfile' |
    'Cancel'

export interface CallGlowPayload {
    method: GlowMethodName
    payload?: string
}

export interface AccountMethod {
    name: AccountMethodName
    data?: string
}

export type AccountIdentifier = number | string

export interface AccountMethodPayload {
    accountId: AccountIdentifier
    method: AccountMethod
}

export interface SendTransferPayload {
    accountId: AccountIdentifier
    transfer: Tx
}

export interface FullMsg {
    actorId: string
    id: string
    cmd: Cmd
    payload: Payload
    origin: string
    from?: string
}

export interface FullResponse {
    id: string
    type: ResponseType
    payload: Payload
    action: Cmd
    origin: string
}

export interface Tx {
    address: string
    amount: number
}

export interface Tab {
    url: string
    id: number
}
export interface Origin {
    origin: string
    acl?: Permissions
    fav?: string
}
export interface Permissions {
    readAddresses: boolean
    readBalance: boolean
    transact: boolean
}
export type PermissionName = 
    'readAddresses' |
    'readBalance' |
    'transact'

export type Error = any

export declare interface AccountBalance {
    total: number
    available: number
    incoming: number
    outgoing: number
}

export interface SimpleAccount {
    id: string
    alias: string
    rawIotaBalance: number
    balance: string
}

export interface SimpleProfile {
    accounts: SimpleAccount[]
    name: string
    id: string
}
