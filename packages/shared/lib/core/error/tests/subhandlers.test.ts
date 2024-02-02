import { handleGenericError } from '../handlers'
import { handleClientError, handleInsufficientFundsError } from '../handlers/walletRs/subhandlers'
// import { handleLedgerError } from '../../ledger/utils/handleLedgerError'
import { logAndNotifyError } from '../actions'
import { WALLET_RS_ERROR_PARAMETERS } from '../constants'
import { ClientError, WalletRsError } from '../enums'

jest.mock('../actions/logAndNotifyError', () => ({ logAndNotifyError: jest.fn() }))
jest.mock('../handlers/handleGenericError', () => ({ handleGenericError: jest.fn() }))
jest.mock('../handlers/walletRs/subhandlers/handleInsufficientFundsError', () => ({
    handleInsufficientFundsError: jest.fn(),
}))
// jest.mock('../../ledger/utils/handleLedgerError', () => ({ handleLedgerError: jest.fn() }))

describe('Module: subhandlers', () => {
    describe('Function: handleClientError', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        it('should call handleGenericError when no message is passed', () => {
            const emptyError = {}
            handleClientError(emptyError)
            expect(handleGenericError).toBeCalledWith(emptyError)
            expect(handleGenericError).toBeCalledTimes(1)
        })

        it('should correctly handle no synced node available', () => {
            const error = { error: '`No synced node available`' }
            const expectedError = {
                ...WALLET_RS_ERROR_PARAMETERS[WalletRsError.Client]?.[ClientError.NoSyncedNode],
                type: undefined,
                message: error.error,
            }
            handleClientError(error, true)

            expect(logAndNotifyError).toHaveBeenCalledWith(expectedError)
            expect(logAndNotifyError).toBeCalledTimes(1)
            expect(handleGenericError).toBeCalledTimes(0)
        })

        it('should correctly handle time not synced', () => {
            const error = { error: "`local time 12 doesn't match the time of the latest slot timestamp: 14`" }
            const expectedError = {
                ...WALLET_RS_ERROR_PARAMETERS[WalletRsError.Client]?.[ClientError.TimeNotSynced],
                type: undefined,
                message: error.error,
            }
            handleClientError(error, true)

            expect(logAndNotifyError).toHaveBeenCalledWith(expectedError)
            expect(logAndNotifyError).toBeCalledTimes(1)
            expect(handleGenericError).toBeCalledTimes(0)
        })

        it('should call handleInsufficientFundsError with ClientError.InsufficientAmount', () => {
            const error = { error: '`insufficient amount: found 14, required 15`' }

            handleClientError(error, true)

            expect(handleInsufficientFundsError).toHaveBeenCalledWith({ type: ClientError.InsufficientAmount })
            expect(handleInsufficientFundsError).toHaveBeenCalledTimes(1)
            expect(handleGenericError).toHaveBeenCalledTimes(0)
        })

        // it('should call handleLedgerError when errorMessage includes a LedgerError value', () => {
        //     const error = { error: 'denied by user' }

        //     handleClientError(error);

        //     expect(handleLedgerError).toHaveBeenCalledWith(error, true);
        //     expect(handleGenericError).toHaveBeenCalledTimes(0)
        // });

        it('should call handleGenericError for unknown error cases', () => {
            const error = { error: 'arbitrary error' }
            const expectedError = {
                logToConsole: true,
                saveToErrorLog: true,
                showNotification: true,
                type: 'Generic',
            }
            handleClientError(error, true)

            expect(handleGenericError).toHaveBeenCalledWith(error)
            expect(handleGenericError).toHaveBeenCalledTimes(1)
        })
    })
})
