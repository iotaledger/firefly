import { get } from 'svelte/store'

import { IAccount } from '@core/account'
import { BASE_TOKEN, NetworkProtocol } from '@core/network'
import { GapLimitProfileConfiguration, UnableToFindProfileTypeError } from '@core/profile'
import { zip } from '@core/utils'
import { formatTokenAmountBestMatch } from '@core/wallet'
import { showAppNotification } from '@lib/notifications'

import { SHIMMER_CLAIMING_ACCOUNT_SYNC_OPTIONS, SHIMMER_CLAIMING_GAP_LIMIT_CONFIGURATION } from '../constants'
import { getSortedRenamedBoundAccounts, prepareShimmerClaimingAccount } from '../helpers'
import { onboardingProfile, shimmerClaimingProfileManager, updateShimmerClaimingAccount } from '../stores'
import { sumTotalUnclaimedRewards } from '../utils'

const NUM_SEARCH_ROUNDS_BEFORE_ACCOUNT_INCREMENT = 2

const DEPTH_SEARCH_ACCOUNT_START_INDEX = 0
const BREADTH_SEARCH_ACCOUNT_GAP_LIMIT = 1
/**
 * NOTE: This variable is uninitialized because we
 * must know the profile type to be able to determine
 * gap limits that are sensible in terms of UX.
 */
let gapLimitProfileConfiguration: GapLimitProfileConfiguration

let depthSearchAccountGapLimit: number
let depthSearchAddressStartIndex: number
let depthSearchAddressGapLimit: number

let breadthSearchAccountStartIndex: number
let breadthSearchAddressGapLimit: number

let totalUnclaimedShimmerRewards: number
let currentSearchRound: number

export function initialiseGapLimitConfiguration(): void {
    const profileType = get(onboardingProfile)?.type
    if (!profileType) {
        throw new UnableToFindProfileTypeError()
    }

    gapLimitProfileConfiguration = SHIMMER_CLAIMING_GAP_LIMIT_CONFIGURATION[profileType]

    depthSearchAccountGapLimit = gapLimitProfileConfiguration.accountGapLimit
    depthSearchAddressStartIndex = 0
    depthSearchAddressGapLimit = gapLimitProfileConfiguration.addressGapLimit

    breadthSearchAccountStartIndex = gapLimitProfileConfiguration.accountGapLimit
    breadthSearchAddressGapLimit = gapLimitProfileConfiguration.addressGapLimit

    currentSearchRound = 1
    totalUnclaimedShimmerRewards = 0
}

// handle errors from await functions, where and how to handle
// consider making parameters into an object

export async function findShimmerRewards(): Promise<void> {
    await depthSearchAndRecoverAccounts()

    if (hasOnlySearchedDepthWindow()) {
        await breadthSearchAndRecoverAccounts()
    }

    updateRewardsFinderParameters()
}

async function breadthSearchAndRecoverAccounts(): Promise<void> {
    const profileManager = get(shimmerClaimingProfileManager)
    for (
        let temporaryAddressStartIndex = 0;
        temporaryAddressStartIndex < breadthSearchAddressGapLimit;
        temporaryAddressStartIndex += gapLimitProfileConfiguration.addressGapLimit
    ) {
        const breadthWindowAccounts = await profileManager?.recoverAccounts(
            breadthSearchAccountStartIndex,
            BREADTH_SEARCH_ACCOUNT_GAP_LIMIT,
            gapLimitProfileConfiguration.addressGapLimit,
            {
                ...SHIMMER_CLAIMING_ACCOUNT_SYNC_OPTIONS,
                addressStartIndex: temporaryAddressStartIndex,
                addressStartIndexInternal: temporaryAddressStartIndex,
            }
        )
        await updateRecoveredAccounts(breadthWindowAccounts)
    }
}

async function depthSearchAndRecoverAccounts(): Promise<void> {
    const profileManager = get(shimmerClaimingProfileManager)
    const depthWindowAccounts = await profileManager?.recoverAccounts(
        DEPTH_SEARCH_ACCOUNT_START_INDEX,
        depthSearchAccountGapLimit,
        depthSearchAddressGapLimit,
        {
            ...SHIMMER_CLAIMING_ACCOUNT_SYNC_OPTIONS,
            addressStartIndex: depthSearchAddressStartIndex,
            addressStartIndexInternal: depthSearchAddressStartIndex,
        }
    )

    await updateRecoveredAccounts(depthWindowAccounts)
}

function hasOnlySearchedDepthWindow(): boolean {
    return currentSearchRound % NUM_SEARCH_ROUNDS_BEFORE_ACCOUNT_INCREMENT === 0
}

function updateRewardsFinderParameters(): void {
    const hasSearchedOnlyDepth = hasOnlySearchedDepthWindow()

    depthSearchAccountGapLimit += hasSearchedOnlyDepth ? 1 : 0
    depthSearchAddressStartIndex += gapLimitProfileConfiguration.addressGapLimit
    /**
     * NOTE: The address gap limit stays the same for the depth window,
     * so there is new assignment statement for its variable.
     */

    breadthSearchAccountStartIndex += hasSearchedOnlyDepth ? 1 : 0
    breadthSearchAddressGapLimit += gapLimitProfileConfiguration.addressGapLimit

    currentSearchRound++
}

async function updateRecoveredAccounts(accounts: IAccount[]): Promise<void> {
    const boundAccounts = await getSortedRenamedBoundAccounts(accounts, shimmerClaimingProfileManager)
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
