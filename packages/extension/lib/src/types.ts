
export interface Tx {
    address: string
    amount: number
}

export interface Mint {
    amount: number
}

export interface Melt {
    color: string
    amount: number
}

export type Arg = string | 
    Tx | 
    Mint | 
    Melt

export type Func = 'sendTransfer' | 
    'mint' | 
    'melt' |
    'getAccounts'
