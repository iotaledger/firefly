import { CoinType } from '@iota/wallet'

import { IAccountFundsSpreaderParameters } from './account-funds-spreader-parameters.interface'

/**
 * The parameters required for spreading funds to addresses of a given seed.
 */
export interface IFundsSpreaderParameters {
    /**
     * The mnemonic used in generating addresses for the funds to be spread amongst.
     */
    mnemonic: string

    /**
     * The coin type used to generate Ed25519 addresses.
     */
    addressGenerationCoinType: CoinType

    /**
     * The coin type used for encoding Ed25519 addresses to Bech32 addresses with
     * either IOTA (iota/atoi) or Shimmer (smr/rms) HRPs.
     *
     * NOTE: IOTA will not be available until the Stardust upgrade
     * is brought to the mainnet and testnet.
     */
    addressEncodingCoinType: CoinType

    /**
     * An array of objects describing the address space for their corresponding account,
     * what addresses hold funds, etc.
     */
    accountsFundsSpreaderParameters: IAccountFundsSpreaderParameters[]

    /**
     * Specifies whether to actually make requests to the faucet for each generated address.
     * This is useful to turn off if you wish to simply generate specific addresses quickly,
     * or simply do NOT wish to spam the faucet.
     */
    requestFundsFromFaucet?: boolean

    /**
     * Specifies whether to backup the resulting generated accounts and addresses
     * to a Stronghold backup file.
     */
    backupToStrongholdFile?: boolean
}
