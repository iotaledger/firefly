import '@mocks/i18n.mock'

import {
    getBestTimeDuration,
    HOURS_PER_DAY,
    MILLISECONDS_PER_SECOND,
    MINUTES_PER_HOUR,
    SECONDS_PER_MINUTE,
} from '@lib/time'

describe('File: time.ts', () => {
    describe('Function: getBestTimeDuration', () => {
        const ZERO_DURATION = '0 days'

        const ONE_MINUTE_MILLIS = SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND
        const ONE_HOUR_MILLIS = MINUTES_PER_HOUR * ONE_MINUTE_MILLIS
        const ONE_DAY_MILLIS = HOURS_PER_DAY * ONE_HOUR_MILLIS

        it('should return zero duration for invalid values', () => {
            expect(getBestTimeDuration(undefined)).toEqual(ZERO_DURATION)
            expect(getBestTimeDuration(Number('theString'))).toEqual(ZERO_DURATION)
            expect(getBestTimeDuration(-1)).toEqual(ZERO_DURATION)
        })

        it('should return zero duration if less than a second', () => {
            expect(getBestTimeDuration(0)).toEqual(ZERO_DURATION)
            expect(getBestTimeDuration(100)).toEqual(ZERO_DURATION)

            expect(getBestTimeDuration(0, 'hour')).toEqual('0 hours')
            expect(getBestTimeDuration(100, 'minute')).toEqual('0 minutes')
            expect(getBestTimeDuration(200, 'second')).toEqual('0 seconds')
        })

        it('should return best duration for valid values', () => {
            expect(getBestTimeDuration(ONE_DAY_MILLIS * 2)).toEqual('2 days')
            expect(getBestTimeDuration(ONE_DAY_MILLIS * 1.5)).toEqual('2 days')
            expect(getBestTimeDuration(ONE_DAY_MILLIS)).toEqual('1 day')

            expect(getBestTimeDuration(ONE_HOUR_MILLIS * 25)).toEqual('2 days')
            expect(getBestTimeDuration(ONE_HOUR_MILLIS * 24)).toEqual('1 day')
            expect(getBestTimeDuration(ONE_HOUR_MILLIS * 12)).toEqual('12 hours')
            expect(getBestTimeDuration(ONE_HOUR_MILLIS)).toEqual('1 hour')

            expect(getBestTimeDuration(ONE_MINUTE_MILLIS * 61)).toEqual('2 hours')
            expect(getBestTimeDuration(ONE_MINUTE_MILLIS * 60)).toEqual('1 hour')
            expect(getBestTimeDuration(ONE_MINUTE_MILLIS * 30)).toEqual('30 minutes')
            expect(getBestTimeDuration(ONE_MINUTE_MILLIS)).toEqual('1 minute')

            expect(getBestTimeDuration(MILLISECONDS_PER_SECOND * 61)).toEqual('2 minutes')
            expect(getBestTimeDuration(MILLISECONDS_PER_SECOND * 60)).toEqual('1 minute')
            expect(getBestTimeDuration(MILLISECONDS_PER_SECOND * 30)).toEqual('30 seconds')
            expect(getBestTimeDuration(MILLISECONDS_PER_SECOND)).toEqual('1 second')
        })
    })
})
