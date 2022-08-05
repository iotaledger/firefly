/* eslint-disable no-console */

import * as path from 'path'

import { AccountManager, CoinType } from '@iota/wallet'

import { BASE_FILE_PATH, NODE_URL, STRONGHOLD_PASSWORD } from '../constants'
import { IFundsSpreaderParameters } from '../interfaces'

export async function spreadFunds(parameters: IFundsSpreaderParameters, round: number = 1): Promise<void> {
    const FUNDS_SPREADER_FILE_PATH = `${BASE_FILE_PATH}/${round}`
    const accountManagerOptions = {
        storagePath: path.resolve(__dirname, '../../', FUNDS_SPREADER_FILE_PATH, 'database'),
        clientOptions: {
            nodes: [NODE_URL],
            localPow: true,
        },
        coinType: CoinType.Shimmer,
        secretManager: {
            Stronghold: {
                snapshotPath: path.resolve(__dirname, '../../', FUNDS_SPREADER_FILE_PATH, 'wallet.stronghold'),
                password: STRONGHOLD_PASSWORD,
            },
        },
    }

    const manager = new AccountManager(accountManagerOptions)
    await manager.verifyMnemonic(parameters?.mnemonic)
    await manager.storeMnemonic(parameters?.mnemonic)

    console.log((await manager?.createAccount({})).meta.publicAddresses[0].address)

    // await Promise.all(
    //     Array.from({ length: parameters?.numberOfAccounts }).map(async (_, idx) => {
    //         const account = await manager?.createAccount({
    //             alias: `Fund Spreader ${round} - Account ${idx + 1}`,
    //         })
    //
    //         const addressGenerationOptions: AddressGenerationOptions = {
    //             internal: false,
    //             metadata: {
    //                 syncing: false,
    //                 network: Network.Testnet,
    //             },
    //         }
    //         const addressAtIndexZero = account?.meta?.publicAddresses[0]
    //         const addressesBeyondIndexZero = await account?.generateAddresses(
    //             parameters?.numberOfAddressesPerAccount - 1,
    //             addressGenerationOptions
    //         )
    //         const addresses = [addressAtIndexZero, ...addressesBeyondIndexZero]
    //         console.assert(parameters?.numberOfAddressesPerAccount === addresses?.length)
    //
    //         console.log(account?.meta?.alias)
    //         await Promise.all(
    //             addresses.map(async (address) => {
    //                 if (parameters?.addressIndicesWithFunds.includes(address?.keyIndex)) {
    //                     console.log(
    //                         `\tAddress Index ${address?.keyIndex}: ${address?.address}${
    //                             address?.keyIndex === addresses.length - 1 ? '\n' : ''
    //                         }`
    //                     )
    //                     await makeFaucetRequest(address?.address)
    //                 }
    //                 await sleep(1000)
    //             })
    //         )
    //         await sleep(1000)
    //     })
    // )
}
