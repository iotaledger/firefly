import { network } from '@core/network'
import { IAsset } from '../../interfaces'
import { NewTokenTransactionDetails } from '../../types'
import { get } from 'svelte/store'
import { getOutputParameters } from '../getOutputParameters'
import { prepareOutput, updateSelectedAccount } from '@core/account'
import { DEFAULT_TRANSACTION_OPTIONS } from '../../constants'
import { validateSendConfirmation } from '.'
import { checkActiveProfileAuth, isActiveLedgerProfile } from '@core/profile'
import { signIscpTransferTransactionData } from '@core/layer-2'
import { ledgerPreparedOutput } from '@core/ledger'
import { sendOutput } from '../../actions'

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
        await sendFromLayer2(transactionDetails, asset)
    }
}

async function sendFromLayer1(
    transactionDetails: NewTokenTransactionDetails,
    accountIndex: number,
    callback: () => void
): Promise<void> {
    const outputParams = getOutputParameters(transactionDetails)
    const preparedOutput = await prepareOutput(accountIndex, outputParams, DEFAULT_TRANSACTION_OPTIONS)

    validateSendConfirmation(preparedOutput)

    if (get(isActiveLedgerProfile)) {
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

async function sendFromLayer2(transactionDetails: NewTokenTransactionDetails, asset: IAsset): Promise<void> {
    const chain = asset.chainId ? get(network)?.getChain(asset.chainId) : undefined
    if (!chain || transactionDetails.recipient?.type !== 'address') {
        return
    }

    const recipient = transactionDetails.recipient.address
    const amount = transactionDetails.rawAmount

    // TODO: For ERC 20 Tokens we need to invoke its specific smartcontract
    updateSelectedAccount({ isTransferring: true })
    await signIscpTransferTransactionData(recipient, asset, amount)
}
