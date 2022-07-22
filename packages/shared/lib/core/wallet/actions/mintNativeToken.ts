import { selectedAccount } from '@core/account'
import { NativeTokenOptions, TransactionOptions } from '@iota/wallet'
import { Converter } from '@lib/converter'
import { isTransferring } from '@lib/wallet'
import { get } from 'svelte/store'
import { Activity } from '../classes'
import { IIrc30Standard } from '../interfaces'
import { addActivityToAccountActivitiesInAllAccountActivities } from '../stores'

export async function mintNativeToken(
    maximumSupply: number,
    circulatingSupply: number,
    metadata: IIrc30Standard
): Promise<void> {
    try {
        isTransferring.set(true)
        const account = get(selectedAccount)
        const nativeTokenOptions: NativeTokenOptions = {
            accountAddress: account.depositAddress,
            maximumSupply: '0x' + maximumSupply.toString(16),
            circulatingSupply: '0x' + circulatingSupply.toString(16),
            foundryMetadata: Array.from(Converter.utf8ToBytes(JSON.stringify(metadata))),
        }
        const transactionOptions: TransactionOptions = {
            remainderValueStrategy: { strategy: 'ReuseAddress', value: null },
        }
        const mintTokenTransaction = await account.mintNativeToken(nativeTokenOptions, transactionOptions)
        addActivityToAccountActivitiesInAllAccountActivities(
            account.id,
            new Activity().setFromTransaction(mintTokenTransaction.transaction, account)
        )
        isTransferring.set(false)
        return
    } catch (err) {
        isTransferring.set(false)
        throw err
    }
}
