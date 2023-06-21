import { getNetwork } from '@core/network'
import { IAsset } from '../../interfaces'
import { NewTokenTransactionDetails } from '../../types'
import { getOutputParameters } from '../getOutputParameters'
import { prepareOutput, updateSelectedAccount } from '@core/account'
import { DEFAULT_TRANSACTION_OPTIONS } from '../../constants'
import { validateSendConfirmation } from '.'
import { checkActiveProfileAuth, getIsActiveLedgerProfile } from '@core/profile'
import { signIscpTransferTransactionData } from '@core/layer-2'
import { ledgerPreparedOutput } from '@core/ledger'
import { sendOutput } from '../../actions'
import { handleError } from '@core/error/handlers'

export async function createTransaction(
    transactionDetails: NewTokenTransactionDetails,
    accountIndex: number,
    callback: () => void
): Promise<void> {
    const asset = transactionDetails.asset
    if (!asset) {
        return
    }

    const isAssetFromLayer1 = !asset.chainId
    if (isAssetFromLayer1) {
        await sendFromLayer1(transactionDetails, accountIndex, callback)
    } else {
        await sendFromLayer2(transactionDetails, asset, callback)
    }
}

async function sendFromLayer1(
    transactionDetails: NewTokenTransactionDetails,
    accountIndex: number,
    callback: () => void
): Promise<void> {
    const outputParams = await getOutputParameters(transactionDetails)
    const preparedOutput = await prepareOutput(accountIndex, outputParams, DEFAULT_TRANSACTION_OPTIONS)

    validateSendConfirmation(preparedOutput)

    if (getIsActiveLedgerProfile()) {
        ledgerPreparedOutput.set(preparedOutput)
    }

    await checkActiveProfileAuth(
        async () => {
            await sendOutput(preparedOutput)
            callback()
        },
        { stronghold: true, ledger: false }
    )
}

async function sendFromLayer2(
    transactionDetails: NewTokenTransactionDetails,
    asset: IAsset,
    callback: () => void
): Promise<void> {
    const chain = asset.chainId ? getNetwork()?.getChain(asset.chainId) : undefined
    const provider = chain?.getProvider()

    if (!chain || !provider || transactionDetails.recipient?.type !== 'address') {
        return
    }

    const recipient = transactionDetails.recipient.address
    const amount = transactionDetails.rawAmount

    // TODO: For ERC 20 Tokens we need to invoke its specific smartcontract
    updateSelectedAccount({ isTransferring: true })
    try {
        const signature = await signIscpTransferTransactionData(recipient, asset, amount)

        if (signature) {
            await provider?.eth.sendSignedTransaction(signature)
            callback()
        }
    } catch (err) {
        handleError(err)
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
