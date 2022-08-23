import { get } from 'svelte/store'

import { getBoundAccount } from '@core/account'
import { localize } from '@core/i18n'
import { BASE_TOKEN, NetworkProtocol } from '@core/network'
import { INITIAL_ACCOUNT_GAP_LIMIT, INITIAL_ADDRESS_GAP_LIMIT, UnableToFindProfileTypeError } from '@core/profile'
import { profileManager } from '@core/profile-manager'
import { sortAccountsByIndex, zip } from '@core/utils'
import { formatTokenAmountBestMatch } from '@core/wallet'
import { showAppNotification } from '@lib/notifications'

import { DEFAULT_SHIMMER_CLAIMING_SYNC_OPTIONS } from '../constants'
import { prepareShimmerClaimingAccount } from '../helpers'
import { onboardingProfile, shimmerClaimingProfileManager, updateShimmerClaimingAccount } from '../stores'
import { sumTotalUnclaimedRewards } from '../utils'

let accountGapLimitIncrement = 1
let accountGapLimit = accountGapLimitIncrement
// let startAccountIndex = 0
let addressGapLimitIncrement = 1
let addressGapLimit = addressGapLimitIncrement
// let startAddressIndex = 0

let haveGapLimitIncrementsBeenSet = false

let totalUnclaimedShimmerRewards = 0

export async function findShimmerRewards(): Promise<void> {
    try {
        if (!haveGapLimitIncrementsBeenSet) {
            setGapLimitIncrements()
        }

        const _shimmerClaimingProfileManager = get(shimmerClaimingProfileManager)
        const accountMetadataList = await _shimmerClaimingProfileManager?.recoverAccounts(
            accountGapLimit,
            addressGapLimit,
            DEFAULT_SHIMMER_CLAIMING_SYNC_OPTIONS
        )
        const boundAccounts = (
            await Promise.all(
                accountMetadataList.map(async (accountMetadata) => {
                    const account = await getBoundAccount(accountMetadata?.index, true, shimmerClaimingProfileManager)
                    account.meta.alias = Number.isNaN(accountMetadata?.alias)
                        ? accountMetadata?.alias
                        : `${localize('general.account')} ${accountMetadata?.index + 1}`
                    return account
                })
            )
        ).sort(sortAccountsByIndex)
        const updatedTotalUnclaimedShimmerRewards = await sumTotalUnclaimedRewards(boundAccounts)
        const wereRewardsFound = updatedTotalUnclaimedShimmerRewards > totalUnclaimedShimmerRewards
        if (wereRewardsFound) {
            const boundTwinAccounts = (
                await Promise.all(
                    boundAccounts.map(async (boundAccount) => {
                        const account = await getBoundAccount(boundAccount?.meta?.index, true, profileManager)
                        account.meta.alias = Number.isNaN(boundAccount?.meta?.alias)
                            ? boundAccount?.meta?.alias
                            : `${localize('general.account')} ${boundAccount?.meta?.index + 1}`
                        return account
                    })
                )
            ).sort(sortAccountsByIndex)
            for (const [boundAccount, boundTwinAccount] of zip(boundAccounts, boundTwinAccounts)) {
                const shimmerClaimingAccount = await prepareShimmerClaimingAccount(boundAccount, boundTwinAccount, true)
                updateShimmerClaimingAccount(shimmerClaimingAccount)
            }

            const foundRewardsAmount = updatedTotalUnclaimedShimmerRewards - totalUnclaimedShimmerRewards
            const foundRewardsAmountFormatted = formatTokenAmountBestMatch(
                foundRewardsAmount,
                BASE_TOKEN[NetworkProtocol.Shimmer]
            )
            showAppNotification({
                type: 'success',
                alert: true,
                message: `Successfully found ${foundRewardsAmountFormatted}`,
            })

            totalUnclaimedShimmerRewards = updatedTotalUnclaimedShimmerRewards

            accountGapLimit = accountGapLimitIncrement
            addressGapLimit = addressGapLimitIncrement

            // startAccountIndex = 0
            // startAddressIndex = 0
        } else {
            // startAccountIndex += accountGapLimitIncrement
            // startAddressIndex += addressGapLimitIncrement
        }
    } catch (err) {
        console.error(err)
    }
}

export function setTotalUnclaimedShimmerRewards(initialTotalUnclaimedShimmerRewards: number): void {
    totalUnclaimedShimmerRewards = initialTotalUnclaimedShimmerRewards
}

function setGapLimitIncrements(): void {
    const profileType = get(onboardingProfile)?.type
    if (!profileType) {
        throw new UnableToFindProfileTypeError()
    }

    accountGapLimitIncrement = INITIAL_ACCOUNT_GAP_LIMIT[profileType]
    addressGapLimitIncrement = INITIAL_ADDRESS_GAP_LIMIT[profileType]

    haveGapLimitIncrementsBeenSet = true
}
