import { get } from 'svelte/store'

import { BASE_TOKEN, NetworkProtocol } from '@core/network'
import { INITIAL_ACCOUNT_GAP_LIMIT, INITIAL_ADDRESS_GAP_LIMIT, UnableToFindProfileTypeError } from '@core/profile'
import { zip } from '@core/utils'
import { formatTokenAmountBestMatch } from '@core/wallet'
import { showAppNotification } from '@lib/notifications'

import { DEFAULT_SHIMMER_CLAIMING_SYNC_OPTIONS } from '../constants'
import { getSortedRenamedBoundAccounts, prepareShimmerClaimingAccount } from '../helpers'
import { onboardingProfile, shimmerClaimingProfileManager, updateShimmerClaimingAccount } from '../stores'
import { sumTotalUnclaimedRewards } from '../utils'

let accountGapLimitIncrement = 1
let accountGapLimit = accountGapLimitIncrement
// let startAccountIndex = 0
let addressGapLimitIncrement = 1
let addressGapLimit = addressGapLimitIncrement
// let startAddressIndex = 0

let totalUnclaimedShimmerRewards = 0

let haveGapLimitIncrementsBeenSet = false

export async function findShimmerRewards(): Promise<void> {
    if (!haveGapLimitIncrementsBeenSet) {
        setGapLimitIncrements()
    }

    const _shimmerClaimingProfileManager = get(shimmerClaimingProfileManager)
    const accountMetadataList = await _shimmerClaimingProfileManager?.recoverAccounts(
        accountGapLimit,
        addressGapLimit,
        DEFAULT_SHIMMER_CLAIMING_SYNC_OPTIONS
    )
    const boundAccounts = await getSortedRenamedBoundAccounts(accountMetadataList, shimmerClaimingProfileManager)
    const updatedTotalUnclaimedShimmerRewards = await sumTotalUnclaimedRewards(boundAccounts)
    const wereRewardsFound = updatedTotalUnclaimedShimmerRewards > totalUnclaimedShimmerRewards
    if (wereRewardsFound) {
        const boundTwinAccounts = await getSortedRenamedBoundAccounts(
            boundAccounts?.map((boundAccount) => boundAccount?.meta)
        )
        for (const [boundAccount, boundTwinAccount] of zip(boundAccounts, boundTwinAccounts)) {
            const shimmerClaimingAccount = await prepareShimmerClaimingAccount(boundAccount, boundTwinAccount, true)
            updateShimmerClaimingAccount(shimmerClaimingAccount)
        }

        showRewardsFoundNotification(updatedTotalUnclaimedShimmerRewards)
        setTotalUnclaimedShimmerRewards(updatedTotalUnclaimedShimmerRewards)
    }

    updateRewardsFinderParameters(wereRewardsFound)
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

function updateRewardsFinderParameters(wereRewardsFound: boolean): void {
    if (wereRewardsFound) {
        accountGapLimit = accountGapLimitIncrement
        addressGapLimit = addressGapLimitIncrement

        // TODO: https://github.com/iotaledger/firefly/issues/4297
        // startAccountIndex = 0
        // startAddressIndex = 0
    } else {
        // TODO: https://github.com/iotaledger/firefly/issues/4297
        // startAccountIndex += accountGapLimitIncrement
        // startAddressIndex += addressGapLimitIncrement
    }
}
