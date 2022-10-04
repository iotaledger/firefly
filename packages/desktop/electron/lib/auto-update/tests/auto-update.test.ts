import { initAutoUpdate } from '../auto-update'
import * as ElectronBuilderConfig from '../../../../electron-builder-config'

describe('File: auto-update.ts', () => {
    describe('Function: initAutoUpdate', () => {
        it('should be true', () => {
            expect(initAutoUpdate()).toEqual(undefined)
        })
    })
})
