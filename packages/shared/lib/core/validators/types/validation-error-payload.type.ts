import { ValidationError } from '../enums'

export type ValidationErrorPayload = {
    type: ValidationError
    error: string
}
