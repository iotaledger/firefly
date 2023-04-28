import { debounce, hex2rgb } from '@core/utils'

describe('File: ui.ts', () => {
    describe('Function: debounce', () => {
        jest.useFakeTimers()
        it('should call the callback function after 100ms', () => {
            const callback = jest.fn()
            const debounced = debounce(callback, 100)
            debounced()
            jest.advanceTimersByTime(100)
            expect(callback).toHaveBeenCalledTimes(1)
        })
        it('should call the callback function once if called multiple times within 100ms', () => {
            const callback = jest.fn()
            const debounced = debounce(callback, 100)
            debounced()
            debounced()
            debounced()
            jest.advanceTimersByTime(100)
            expect(callback).toHaveBeenCalledTimes(1)
        })
        it('should call the callback function twice if called multiple times with 100ms interval', () => {
            const callback = jest.fn()
            const debounced = debounce(callback, 100)
            debounced()
            jest.advanceTimersByTime(100)
            debounced()
            jest.advanceTimersByTime(100)
            expect(callback).toHaveBeenCalledTimes(2)
        })
    })
    describe('Function: hex2rgb', () => {
        it('should convert hex to rgb', () => {
            expect(hex2rgb('#000000')).toEqual('0,0,0')
        })
        it('should return RGB values for white if input string has length less than 7', () => {
            expect(hex2rgb('')).toEqual('255,255,255')
        })
        it('should return RGB values of initial 7 chars if input string has length greater than 7', () => {
            expect(hex2rgb('#0F0F0F9')).toEqual('15,15,15')
        })
    })
})
