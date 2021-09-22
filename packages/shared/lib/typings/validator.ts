export enum ErrorTypes {
    UnknownId = 'UnknownId',
    InvalidType = 'InvalidType',
    EmptyResponse = 'EmptyResponse',
}

export type ErrorObject = {
    type: ErrorTypes
    error: string
}

export type ValidationResponse = {
    isValid: boolean
    payload: ErrorObject
}
