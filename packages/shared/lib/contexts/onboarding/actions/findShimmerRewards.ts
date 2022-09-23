import { get } from 'svelte/store'

import { BASE_TOKEN, NetworkProtocol } from '@core/network'
import { GapLimitProfileConfiguration, UnableToFindProfileTypeError } from '@core/profile'
import { zip } from '@core/utils'
import { formatTokenAmountBestMatch } from '@core/wallet'
import { showAppNotification } from '@lib/notifications'

import { SHIMMER_CLAIMING_ACCOUNT_SYNC_OPTIONS, SHIMMER_CLAIMING_GAP_LIMIT_CONFIGURATION } from '../constants'
import { getSortedRenamedBoundAccounts, prepareShimmerClaimingAccount } from '../helpers'
import { onboardingProfile, shimmerClaimingProfileManager, updateShimmerClaimingAccount } from '../stores'
import { sumTotalUnclaimedRewards } from '../utils'

/**
 * NOTE: This variable is unitialized because we
 * must know the profile type to be able to determine
 * gap limits that are sensible in terms of UX.
 */
let gapLimitProfileConfiguration: GapLimitProfileConfiguration

let totalUnclaimedShimmerRewards = 0

export async function findShimmerRewards(): Promise<void> {
    if (gapLimitProfileConfiguration) {
        const profileType = get(onboardingProfile)?.type
        const hasMismatchedProfileType =
            gapLimitProfileConfiguration.addressGapLimit !==
            SHIMMER_CLAIMING_GAP_LIMIT_CONFIGURATION[profileType].addressGapLimit
        if (hasMismatchedProfileType) {
            setGapLimitConfiguration()
        }
    } else {
        setGapLimitConfiguration()
    }

    const _shimmerClaimingProfileManager = get(shimmerClaimingProfileManager)

    const { accountGapLimit, addressGapLimit } = gapLimitProfileConfiguration
    const unboundAccounts = await _shimmerClaimingProfileManager?.recoverAccounts(
        0,
        accountGapLimit,
        addressGapLimit,
        SHIMMER_CLAIMING_ACCOUNT_SYNC_OPTIONS
    )
    const boundAccounts = await getSortedRenamedBoundAccounts(unboundAccounts, shimmerClaimingProfileManager)
    const updatedTotalUnclaimedShimmerRewards = await sumTotalUnclaimedRewards(boundAccounts)
    const hasNewRewards = updatedTotalUnclaimedShimmerRewards > totalUnclaimedShimmerRewards
    if (hasNewRewards) {
        const boundTwinAccounts = await getSortedRenamedBoundAccounts(boundAccounts)
        for (const [boundAccount, boundTwinAccount] of zip(boundAccounts, boundTwinAccounts)) {
            const shimmerClaimingAccount = await prepareShimmerClaimingAccount(boundAccount, boundTwinAccount, true)
            updateShimmerClaimingAccount(shimmerClaimingAccount)
        }

        showRewardsFoundNotification(updatedTotalUnclaimedShimmerRewards)
        setTotalUnclaimedShimmerRewards(updatedTotalUnclaimedShimmerRewards)
    }

    updateRewardsFinderParameters(hasNewRewards)
}

function setGapLimitConfiguration(): void {
    const profileType = get(onboardingProfile)?.type
    if (!profileType) {
        throw new UnableToFindProfileTypeError()
    }

    gapLimitProfileConfiguration = SHIMMER_CLAIMING_GAP_LIMIT_CONFIGURATION[profileType]
}

export function setTotalUnclaimedShimmerRewards(_totalUnclaimedShimmerRewards: number): void {
    totalUnclaimedShimmerRewards = _totalUnclaimedShimmerRewards
}

function showRewardsFoundNotification(updatedTotalUnclaimedShimmerRewards: number): void {
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
}

function updateRewardsFinderParameters(hasNewRewards: boolean): void {
    if (hasNewRewards) {
        accountGapLimit = accountGapLimitIncrement
        addressGapLimit = addressGapLimitIncrement
    } else {
        accountGapLimit += accountGapLimitIncrement
        addressGapLimit += addressGapLimitIncrement
    }
}
