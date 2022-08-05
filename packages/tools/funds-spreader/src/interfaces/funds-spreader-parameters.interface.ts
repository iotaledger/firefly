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
     * The coin type used to generate the Ed25519 address.
     */
    addressGenerationCoinType: CoinType

    /**
     * The coin type used for encoding the Ed25519 address to a Bech32 address with
     * either IOTA (iota/atoi) or Shimmer (smr/rms) HRPs.
     */
    addressEncodingCoinType: CoinType

    /**
     * An array of objects describing the address space for their corresponding account,
     * what addresses hold funds, etc.
     */
    accountFundsSpreaderParameters: IAccountFundsSpreaderParameters[]
}
