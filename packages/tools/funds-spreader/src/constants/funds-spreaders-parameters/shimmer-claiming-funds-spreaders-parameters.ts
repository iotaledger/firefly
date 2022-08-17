import { CoinType } from '@iota/wallet'

import { IFundsSpreaderParameters } from '../../interfaces'

/**
 * The specific funds spreaders parameters for Shimmer claiming testing.
 */
export const SHIMMER_CLAIMING_FUNDS_SPREADERS_PARAMETERS: IFundsSpreaderParameters[] = [
    // 1. Unclaimed Shimmer tokens on one account (index `0`) and one or more addresses (index `0`)
    {
        mnemonic:
            'ecology cotton whale envelope emotion thing advance horse champion thing thought tomorrow brother erupt blame yellow curtain wasp resist town quarter pretty tell wrestle',
        accountsFundsSpreaderParameters: [
            {
                accountIndex: 0,
                addressIndicesWithFunds: [0, 2],
            },
        ],
    },

    // // 2. Unclaimed Shimmer tokens on one account (index `0`) and one or more addresses (index `1+`)
    // {
    //     mnemonic:
    //         'doll buffalo journey tennis second skin aerobic bridge carpet peanut demise note blind coconut parade cluster where describe dream great network cage student frost',
    //     accountsFundsSpreaderParameters: [
    //         {
    //             accountIndex: 0,
    //             addressIndicesWithFunds: [2, 10],
    //         },
    //     ],
    // },
    //
    // // 3. Unclaimed Shimmer tokens on one account (index `1+`) and one or more addresses (index `0`)
    // {
    //     mnemonic:
    //         'dial member lemon fiber era eagle safe shallow latin zoo salmon all way stool that basket grid letter yard dish absorb tackle hand bike',
    //     accountsFundsSpreaderParameters: [
    //         {
    //             accountIndex: 2,
    //             addressIndicesWithFunds: [0, 2],
    //         },
    //     ],
    // },
    //
    // // 4. Unclaimed Shimmer tokens on one account (index `1+`) and one or more addresses (index `1+`)
    // {
    //     mnemonic:
    //         'sunny convince wife claim capital exercise admit scheme prepare panther six buffalo humble rack deny render guitar fade dance bean wall half sunny library',
    //     accountsFundsSpreaderParameters: [
    //         {
    //             accountIndex: 2,
    //             addressIndicesWithFunds: [2, 10],
    //         },
    //     ],
    // },
    //
    // // 5. Unclaimed Shimmer tokens on many accounts (index `0-n`) and one or more addresses (index `0`) for each account
    // {
    //     mnemonic:
    //         'hello remember gentle envelope brain lock chief time jazz glare habit jelly fetch scare hour surprise chest what into away confirm come chimney bubble',
    //     accountsFundsSpreaderParameters: [
    //         {
    //             accountIndex: 0,
    //             addressIndicesWithFunds: [0, 2],
    //         },
    //         {
    //             accountIndex: 1,
    //             addressIndicesWithFunds: [0, 2],
    //         },
    //         {
    //             accountIndex: 2,
    //             addressIndicesWithFunds: [0, 2],
    //         },
    //     ],
    // },
    //
    // // 6. Unclaimed Shimmer tokens on many accounts (index `0-n`) and one or more addresses (index `1+`) for each account
    // {
    //     mnemonic:
    //         'bright index tortoise impact profit segment analyst year law quiz barely below baby marine half battle glimpse else cost mercy swing oyster dragon surround',
    //     accountsFundsSpreaderParameters: [
    //         {
    //             accountIndex: 0,
    //             addressIndicesWithFunds: [2, 10],
    //         },
    //         {
    //             accountIndex: 1,
    //             addressIndicesWithFunds: [2, 10],
    //         },
    //         {
    //             accountIndex: 2,
    //             addressIndicesWithFunds: [2, 10],
    //         },
    //     ],
    // },

    // // 7. Unclaimed Shimmer tokens on many accounts (index `1-n`) and one or more addresses (index `0`) for each account
    // {
    //     mnemonic: 'nuclear vote book peanut wage parrot cereal control glory deer bronze select wink miss spread sunset universe sheriff broccoli pyramid keen drink virus need',
    // },
    //
    // // 8. Unclaimed Shimmer tokens on many accounts (index `1-n`) and one or more addresses (index `1+`) for each account
    // {
    //     mnemonic: 'noble prepare reveal trigger guide area beyond dice wood bind trash jeans federal avocado parrot angle uncover crew weather order still blame master suffer',
    // },
    //
    // // 9. Scenarios 1-8 except some Shimmer tokens have already been claimed on only one account (random index)
    // {
    //     mnemonic: 'pelican sting violin evil bridge response trophy limit veteran limit corn run hat fashion apple sick reform knife speed canoe glue dawn sunset measure',
    // },
    //
    // // 10. Scenarios 1-8 except some Shimmer tokens have already been claimed on more than one account
    // {
    //     mnemonic: 'truth bamboo chicken skill spare perfect spell stage arrive hundred casual stem source impose cherry picnic million outside pottery half maid federal fox kick',
    // },
    //
    // // 11. Scenarios 1-8 except all Shimmer tokens have already been claimed on only one account (random index)
    // {
    //     mnemonic: 'palace antenna sudden resource floor mechanic chimney exotic genius hint imitate swift escape wide boost tobacco world foot arrest outside enact quality onion extend',
    // },
    //
    // // 12. Scenarios 1-8 except all Shimmer tokens have already been claimed on all accounts
    // {
    //     mnemonic: 'choice matter bus zoo wagon they weekend love urge unique pulse found coin bottom panel animal mix cactus staff orbit jar drop love artwork',
    // },
    //
    // // 13. Any of the above with a Ledger device where there are too many outputs
    // {
    //     mnemonic: 'juice virus tobacco total train kitchen core ability twist firm network retire cradle vehicle prison soap affair police destroy dignity cancel across horse over',
    // },
].map((fundsSpreaderParameters) => ({
    ...fundsSpreaderParameters,
    addressGenerationCoinType: CoinType.IOTA,
    addressEncodingCoinType: CoinType.Shimmer,
}))
