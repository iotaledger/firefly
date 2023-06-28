import { get } from 'svelte/store'

import { IError } from '../interfaces'
import { addError, errorLog } from '../stores'

describe('Module: errors', () => {
    describe('Function: addError', () => {
        it('should append given errors to the error log', () => {
            expect(get<IError[]>(errorLog).length).toEqual(0)

            const error: IError = {
                time: Date.now(),
                type: 'The error type',
                message: 'The message of the error',
                stack: {
                    some: 'functionName',
                    stack: 'functionCall',
                    object: 'init',
                },
            }
            addError(error)

            expect(get<IError[]>(errorLog).length).toEqual(1)
        })
    })
})
