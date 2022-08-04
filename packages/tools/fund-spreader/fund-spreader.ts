/* eslint-disable no-console */

import axios, { AxiosResponse } from 'axios'
import * as fs from 'fs'
import * as path from 'path'

import { AccountManager, AddressGenerationOptions, CoinType, Network } from '@iota/wallet'

import { IFaucetRequestData, IFaucetResponseData, IFundSpreaderParameters } from './interfaces'

const BASE_FILE_PATH = './fund-spreader/temp'

// const NODE_URL = 'https://api.testnet.shimmer.network'
// const FAUCET_API_ENDPOINT = 'https://faucet.testnet.shimmer.network/api/enqueue'

const NODE_URL = 'https://api.alphanet.iotaledger.net'
const FAUCET_API_ENDPOINT = 'http://faucet.alphanet.iotaledger.net/api/enqueue'

const STRONGHOLD_PASSWORD = 'hello-iota-1234'

const FUND_SPREADERS_PARAMETERS: IFundSpreaderParameters[] = [
    // 1. Unclaimed Shimmer tokens on one account (index `0`) and one or more addresses (index `0`)
    {
        spreaderNumber: 1,
        mnemonic:
            'ecology cotton whale envelope emotion thing advance horse champion thing thought tomorrow brother erupt blame yellow curtain wasp resist town quarter pretty tell wrestle',
        numberOfAccounts: 1,
        numberOfAddressesPerAccount: 1,
        addressIndicesWithFunds: [0],
    },

    // 2. Unclaimed Shimmer tokens on one account (index `0`) and one or more addresses (index `1+`)
    {
        spreaderNumber: 2,
        mnemonic:
            'doll buffalo journey tennis second skin aerobic bridge carpet peanut demise note blind coconut parade cluster where describe dream great network cage student frost',
        numberOfAccounts: 1,
        numberOfAddressesPerAccount: 10,
        addressIndicesWithFunds: [0, 1, 3, 5, 9],
    },

    // 3. Unclaimed Shimmer tokens on one account (index `1+`) and one or more addresses (index `0`)
    // 4. Unclaimed Shimmer tokens on one account (index `1+`) and one or more addresses (index `1+`)
    // 5. Unclaimed Shimmer tokens on many accounts (index `0-n`) and one or more addresses (index `0`) for each account
    // 6. Unclaimed Shimmer tokens on many accounts (index `0-n`) and one or more addresses (index `1+`) for each account
    // 7. Unclaimed Shimmer tokens on many accounts (index `1-n`) and one or more addresses (index `0`) for each account
    // 8. Unclaimed Shimmer tokens on many accounts (index `1-n`) and one or more addresses (index `1+`) for each account
    // 9. Scenarios 1-8 except some Shimmer tokens have already been claimed on only one account (random index)
    // 10. Scenarios 1-8 except some Shimmer tokens have already been claimed on more than one account
    // 11. Scenarios 1-8 except all Shimmer tokens have already been claimed on only one account (random index)
    // 12. Scenarios 1-8 except all Shimmer tokens have already been claimed on all accounts
    // 13. Any of the above with a Ledger device where there are too many outputs
]

async function runFundSpreader(): Promise<void> {
    try {
        cleanupOldAccountManagerData()
        await Promise.all(
            FUND_SPREADERS_PARAMETERS.map(async (fsp) => {
                await spreadFunds(fsp)
            })
        )
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

async function spreadFunds(parameters: IFundSpreaderParameters): Promise<void> {
    const accountManagerOptions = {
        storagePath: `${BASE_FILE_PATH}/${parameters?.spreaderNumber}/database`,
        clientOptions: {
            nodes: [NODE_URL],
            localPow: true,
        },
        coinType: CoinType.Shimmer,
        secretManager: {
            Stronghold: {
                snapshotPath: `${BASE_FILE_PATH}/${parameters?.spreaderNumber}/wallet.stronghold`,
                password: STRONGHOLD_PASSWORD,
            },
        },
    }

    const manager = new AccountManager(accountManagerOptions)
    await manager.verifyMnemonic(parameters?.mnemonic)
    await manager.storeMnemonic(parameters?.mnemonic)

    await Promise.all(
        Array.from({ length: parameters?.numberOfAccounts }).map(async (_, idx) => {
            const account = await manager?.createAccount({
                alias: `Fund Spreader ${parameters?.spreaderNumber} - Account ${idx + 1}`,
            })

            const addressGenerationOptions: AddressGenerationOptions = {
                internal: false,
                metadata: {
                    syncing: false,
                    network: Network.Testnet,
                },
            }
            const addressAtIndexZero = account?.meta?.publicAddresses[0]
            const addressesBeyondIndexZero = await account?.generateAddresses(
                parameters?.numberOfAddressesPerAccount - 1,
                addressGenerationOptions
            )
            const addresses = [addressAtIndexZero, ...addressesBeyondIndexZero]
            console.assert(parameters?.numberOfAddressesPerAccount === addresses?.length)

            console.log(account?.meta?.alias)
            await Promise.all(
                addresses.map(async (address) => {
                    if (parameters?.addressIndicesWithFunds.includes(address?.keyIndex)) {
                        console.log(
                            `\tAddress Index ${address?.keyIndex}: ${address?.address}${
                                address?.keyIndex === addresses.length - 1 ? '\n' : ''
                            }`
                        )
                        await makeFaucetRequest(address?.address)
                    }
                    await sleep(100)
                })
            )
            await sleep(1000)
        })
    )
}

function cleanupOldAccountManagerData(): void {
    fs.rmSync(path.resolve(`${BASE_FILE_PATH}`), { recursive: true, force: true })
}

async function makeFaucetRequest(address: string): Promise<IFaucetResponseData> {
    if (!address) {
        throw new Error('Invalid address')
    }

    return new Promise((resolve) => {
        axios
            .post(FAUCET_API_ENDPOINT, prepareFaucetRequestData(address))
            .then((response: AxiosResponse<IFaucetResponseData>) => {
                resolve(response?.data)
            })
            .catch((error) => {
                console.error(error)
                process.exit(1)
            })
    })
}

function prepareFaucetRequestData(address: string): IFaucetRequestData {
    return {
        address,
    }
}

async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

void runFundSpreader()
