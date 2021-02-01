export interface AddressOutput {
    address: string;
    amount: number;
    index: number;
    // TODO: Rename to camelCase
    is_spent: boolean;
    message_id: string;
    // TODO: Should be a string
    transaction_id: number[];
}

export interface Address {
    address: string;
    balance: number;
    keyIndex: number;
    internal: boolean;
    outputs: AddressOutput[];
}
