export interface AddressOutput {
    address: string;
    amount: number;
    index: number;
    isSpent: boolean;
    messageId: string;
    transactionId: number[];
}

export interface Address {
    address: string;
    balance: number;
    keyIndex: number;
    internal: boolean;
    outputs: AddressOutput[];
}
