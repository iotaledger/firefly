import { shouldReportError } from '../should-report-error.handler'

describe('File: should-report-error.handler.ts', () => {
    describe('Function: shouldReportError', () => {
        it('should not report chromium network error', () => {
            expect(shouldReportError('net::ERR_FAILED')).toEqual(false)
        })
        it('should not report neon binding send error', () => {
            expect(shouldReportError('neon::event::Channel::send')).toEqual(false)
        })
        it('should report error', () => {
            expect(shouldReportError('neon::event::Channel::claim')).toEqual(true)
        })
    })
})
