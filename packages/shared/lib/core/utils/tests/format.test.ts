import { formatHexString } from '@core/utils/format'

describe('File: format.ts', () => {
    describe('Function: formatHexString', () => {
        const NULL_RESULT = '00'

        it('should handle invalid input', () => {
            expect(formatHexString(undefined)).toEqual(NULL_RESULT)
            expect(formatHexString('')).toEqual(NULL_RESULT)
            expect(formatHexString('xyz')).toEqual(NULL_RESULT)
        })
        it('should handle invalid hex strings', () => {
            expect(formatHexString('123G')).toEqual(NULL_RESULT)
            expect(formatHexString('0x123G')).toEqual(NULL_RESULT)
        })
        it('should handle valid hex strings', () => {
            expect(formatHexString('0')).toEqual('0x0')
            expect(formatHexString('0x1')).toEqual('0x1')
            expect(formatHexString('0x1a2b3c')).toEqual('0x1A2B3C')
        })
        it('should handle valid hex strings with modifications', () => {
            expect(formatHexString('0', true, false)).toEqual('0')
            expect(formatHexString('0x1', false, false)).toEqual('1')
            expect(formatHexString('0x1a2b3c', true, true)).toEqual('0x1A2B3C')
            expect(formatHexString('0x1A2B3C', false, true)).toEqual('0x1a2b3c')
        })
    })
})
