import type { IOutputMetadataResponse, ITransactionPayload } from '@iota/types';

export type IncomingTransactionData = [
    ITransactionPayload,
    IOutputMetadataResponse[],
];
