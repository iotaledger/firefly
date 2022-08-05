/**
 * The address space of a particular account.
 */
export interface IAccountFundsSpreaderParameters {
    /**
     * The account index to generate addresses on.
     */
    accountIndex: number

    /**
     * The particular addresses to generate for spreading funds to.
     */
    addressIndicesWithFunds: number[]
}
