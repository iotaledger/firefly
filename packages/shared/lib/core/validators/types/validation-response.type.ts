import { ValidationErrorPayload } from './validation-error-payload.type'

export type ValidationResponse = {
    isValid: boolean
    payload: ValidationErrorPayload
}
