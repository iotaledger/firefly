/* eslint-disable no-console */

import axios, { AxiosResponse } from 'axios'
import * as fs from 'fs'
import * as path from 'path'

import { AccountManager, AddressGenerationOptions, CoinType, Network } from '@iota/wallet'

import { IFaucetRequestData, IFaucetResponseData } from './interfaces'

const BASE_FILE_PATH = './fund-spreader/temp'

const FAUCET_API_ENDPOINT = 'https://faucet.testnet.shimmer.network/api/enqueue'

const MNEMONIC =
    'ecology cotton whale envelope emotion thing advance horse champion thing thought tomorrow brother erupt blame yellow curtain wasp resist town quarter pretty tell wrestle'
const STRONGHOLD_PASSWORD = 'hello-iota-1234'

async function spreadFunds(): Promise<void> {
    try {
        cleanupOldAccountManagerData()

        const manager = await createAccountManager()

        const account = await manager?.createAccount({
            alias: 'Fund Spreader',
        })
        console.log('ACCOUNT: ', account)

        const addressGenerationOptions: AddressGenerationOptions = {
            internal: false,
            metadata: {
                syncing: false,
                network: Network.Testnet,
            },
        }
        const addressAtIndexZero = account?.meta?.publicAddresses[0]
        const addressesBeyondIndexZero = await account?.generateAddresses(1, addressGenerationOptions)
        const addresses = [addressAtIndexZero, ...addressesBeyondIndexZero]
        const address = addresses[0]
        console.log('ADDRESS: ', address)

        const faucetResponse = await makeFaucetRequest(address?.address)
        console.log('FAUCET RESPONSE: ', faucetResponse)
    } catch (error) {
        console.error(error)
        process.exit(1)
    } finally {
        process.exit(0)
    }
}

function cleanupOldAccountManagerData(): void {
    fs.rmSync(path.resolve(`${BASE_FILE_PATH}`), { recursive: true, force: true })
}

async function createAccountManager(): Promise<AccountManager> {
    const accountManagerOptions = {
        storagePath: `${BASE_FILE_PATH}/database`,
        clientOptions: {
            nodes: ['https://api.testnet.shimmer.network'],
            localPow: true,
        },
        coinType: CoinType.Shimmer,
        secretManager: {
            Stronghold: {
                snapshotPath: `${BASE_FILE_PATH}/wallet.stronghold`,
                password: STRONGHOLD_PASSWORD,
            },
        },
    }

    const manager = new AccountManager(accountManagerOptions)
    await manager.verifyMnemonic(MNEMONIC)
    await manager.storeMnemonic(MNEMONIC)
    return manager
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

void spreadFunds()
