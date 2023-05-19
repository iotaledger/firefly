import { debounce, getBackupWarningColor, isBright } from '../ui'
import { DAYS_PER_WEEK, MILLISECONDS_PER_DAY } from '../constants'

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
        it('should call the callback function twice if called multiple times with 100ms intervals between', () => {
            const callback = jest.fn()
            const debounced = debounce(callback, 100)
            debounced()
            debounced()
            debounced()
            jest.advanceTimersByTime(100)
            debounced()
            debounced()
            jest.advanceTimersByTime(100)
            expect(callback).toHaveBeenCalledTimes(2)
        })
    })
    describe('Function: clickOutside', () => {
        // it.todo('needs a UI testing library to test')
    })
    describe('Function: isBright', () => {
        it('should return true if color is bright', () => {
            expect(isBright('#FFFFFF')).toEqual(true)
            expect(isBright('255,255,255')).toEqual(true)
        })
        it('should return the same boolean for identical 3 and 6 value HEX colors', () => {
            expect(isBright('#CCC')).toEqual(isBright('#CCCCCC'))
        })
        it('should return false if color is not bright', () => {
            expect(isBright('#000000')).toEqual(false)
            expect(isBright('0,0,0')).toEqual(false)
        })
        it('should return false if color is empty', () => {
            expect(isBright('')).toEqual(false)
        })
    })
    describe('Function: getBackupWarningColor', () => {
        it('should return a color depending on the last backup date', () => {
            const oneWeekAgo = new Date(Date.now() - DAYS_PER_WEEK * MILLISECONDS_PER_DAY)
            const twoMonthsAgo = new Date(Date.now() - 2 * 30 * MILLISECONDS_PER_DAY)
            const oneYearAgo = new Date(Date.now() - 365 * MILLISECONDS_PER_DAY)

            expect(getBackupWarningColor(oneWeekAgo)).toEqual('blue')
            expect(getBackupWarningColor(twoMonthsAgo)).toEqual('yellow')
            expect(getBackupWarningColor(oneYearAgo)).toEqual('orange')
            expect(getBackupWarningColor(null)).toEqual('red')
        })
    })
    describe('Function: slidable', () => {
        // it.todo('needs a UI testing library to test')
    })
})
