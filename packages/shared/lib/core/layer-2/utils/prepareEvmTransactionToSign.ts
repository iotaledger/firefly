import { get } from 'svelte/store'

import { selectedAccountIndex } from '@core/account/stores'
import { Ledger } from '@core/ledger/classes'

import { buildBip32Path } from '@core/account/utils'
// import { EvmTransactionOptions } from '../types'
// import { prepareErc20EvmTransactionData } from './prepareErc20EvmTransactionData'

export function prepareEvmTransactionToSign(): void {
    const coinType = 60
    const accountIndex = get(selectedAccountIndex)
    const bip32Path = buildBip32Path(coinType, accountIndex)

    // const transactionData = await prepareErc20EvmTransactionData(options)
    const fakeTransactionData = {
        // ...options,
        nonce: '0x0',
        gasPrice: '0x1500000007',
        gasLimit: '0xead4',
        to: '0x68194a729C2450ad26072b3D33ADaCbcef39D574',
        value: '0x0',
        data: '0xa9059cbb0000000000000000000000001bf171563b2642bb6e93081a7a1f2e6b16a54c930000000000000000000000000000000000000000000000000de0b6b3a7640000',
    }
    Ledger.signEvmTransaction(fakeTransactionData, bip32Path)
}
