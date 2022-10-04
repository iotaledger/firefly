import { createTemplate, createContextMenu } from '../menu-template'

beforeAll(() => {
    const APP_ID = 'org.iota.firefly-shimmer'
    const v8debug = {}
})

describe('File: menu-template.ts', () => {
    describe('Function: createTemplate', () => {
        it('should be true', () => {
            expect(createTemplate()).not.toEqual(undefined)
        })
    })
    describe('Function: createContextMenu', () => {
        it('should be true', () => {
            expect(createContextMenu()).not.toEqual(undefined)
        })
    })
})
