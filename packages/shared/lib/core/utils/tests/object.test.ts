import '@mocks/i18n.mock'
import { resolveObjectPath } from '@core/utils'

describe('Module: object', () => {
    describe('Function: resolveObjectPath', () => {
        it('should return default value if attributes is missing', () => {
            expect(resolveObjectPath(undefined, 'testPath', 'default')).toBe('default')
            expect(resolveObjectPath({ test: 'testValue' }, undefined, 'default')).toBe('default')
            expect(resolveObjectPath(undefined, undefined, 'default')).toBe('default')
        })
        it('should return default value if path is pointing to missing location', () => {
            expect(resolveObjectPath({}, 'aaa.bbb.cccc', 'default')).toBe('default')
            expect(resolveObjectPath({ test: 'testValue' }, 'aaa.bbb.cccc', 'default')).toBe('default')
        })
        it('should return correct value if path is resolvable', () => {
            expect(resolveObjectPath({ test: 'testValue' }, 'test', 'default')).toBe('testValue')
            expect(resolveObjectPath({ test: { nestedTest: 'nestedTestValue' } }, 'test.nestedTest', 'default')).toBe(
                'nestedTestValue'
            )
        })
    })
})
