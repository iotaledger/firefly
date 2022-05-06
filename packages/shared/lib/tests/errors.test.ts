import { get } from 'svelte/store'
import { addError, errorLog } from '../errors'
import { Error } from '../typings/error'

describe('File: errors.ts', () => {
    describe('Function: addError', () => {
        it('should append given errors to the error log', () => {
            expect(get(errorLog).length).toEqual(0)

            const error: Error = {
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

            expect(get(errorLog).length).toEqual(1)
        })
    })
})
