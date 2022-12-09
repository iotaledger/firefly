import { Answer } from './answer.interface'

// TODO: remove Question once wallet.rs exposed this type
export interface Question {
    text: string
    answers: Answer[]
    additionalInfo: string
}
