/* eslint-disable no-console */

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

/**
 * NOTE: This variable is uninitialized because we
 * must know the profile type to be able to determine
 * gap limits that are sensible in terms of UX.
 */
let gapLimitProfileConfiguration: GapLimitProfileConfiguration

let depthWindowAccountStartIndex: number
let depthWindowAccountGapLimit: number
let depthWindowAddressStartIndex: number
let depthWindowAddressGapLimit: number

let breadthWindowAccountStartIndex: number
let breadthWindowAccountGapLimit: number
let breadthWindowAddressStartIndex: number
let breadthWindowAddressGapLimit: number

let totalUnclaimedShimmerRewards: number
let currentSearchRound: number

export function initialiseGapLimitConfiguration(): void {
    const profileType = get(onboardingProfile)?.type
    if (!profileType) {
        throw new UnableToFindProfileTypeError()
    }

    gapLimitProfileConfiguration = SHIMMER_CLAIMING_GAP_LIMIT_CONFIGURATION[profileType]

    depthWindowAccountStartIndex = 0
    depthWindowAccountGapLimit = gapLimitProfileConfiguration.accountGapLimit
    depthWindowAddressStartIndex = 0
    depthWindowAddressGapLimit = gapLimitProfileConfiguration.addressGapLimit

    breadthWindowAccountStartIndex = gapLimitProfileConfiguration.accountGapLimit
    breadthWindowAccountGapLimit = 1
    breadthWindowAddressStartIndex = 0
    breadthWindowAddressGapLimit = gapLimitProfileConfiguration.addressGapLimit

    currentSearchRound = 1
    totalUnclaimedShimmerRewards = 0
}

// handle errors from await functions, where and how to handle
// consider making parameters into an object

export async function findShimmerRewards(): Promise<void> {
    await recoverAccountsInSeries()
    updateRewardsFinderParameters()
}

async function recoverAccountsInSeries(): Promise<void> {
    const _shimmerClaimingProfileManager = get(shimmerClaimingProfileManager)

    console.log('DEPTH WINDOW ACCOUNT START INDEX: ', depthWindowAccountStartIndex)
    console.log('DEPTH WINDOW ACCOUNT GAP LIMIT: ', depthWindowAccountGapLimit)
    console.log('DEPTH WINDOW ADDRESS START INDEX: ', depthWindowAddressStartIndex)
    console.log('DEPTH WINDOW ADDRESS GAP LIMIT: ', depthWindowAddressGapLimit)

    const depthWindowAccounts = await _shimmerClaimingProfileManager?.recoverAccounts(
        depthWindowAccountStartIndex,
        depthWindowAccountGapLimit,
        depthWindowAddressGapLimit,
        {
            ...SHIMMER_CLAIMING_ACCOUNT_SYNC_OPTIONS,
            addressStartIndex: depthWindowAddressStartIndex,
            addressStartIndexInternal: depthWindowAddressStartIndex,
        }
    )
    await updateRecoveredAccounts(depthWindowAccounts)

    if (hasOnlySearchedDepthWindow()) {
        console.log('BREADTH WINDOW ACCOUNT START INDEX: ', breadthWindowAccountStartIndex)
        console.log('BREADTH WINDOW ACCOUNT GAP LIMIT: ', breadthWindowAccountGapLimit)
        console.log('BREADTH WINDOW ADDRESS START INDEX: ', breadthWindowAddressStartIndex)
        console.log('BREADTH WINDOW ADDRESS GAP LIMIT: ', breadthWindowAddressGapLimit)

        let temporaryAddressStartIndex = 0
        while (temporaryAddressStartIndex < breadthWindowAddressGapLimit) {
            console.log('TEMP ADDR START IDX: ', temporaryAddressStartIndex)
            const breadthWindowAccounts = await _shimmerClaimingProfileManager?.recoverAccounts(
                breadthWindowAccountStartIndex,
                breadthWindowAccountGapLimit,
                gapLimitProfileConfiguration.addressGapLimit,
                {
                    ...SHIMMER_CLAIMING_ACCOUNT_SYNC_OPTIONS,
                    addressStartIndex: temporaryAddressStartIndex,
                    addressStartIndexInternal: temporaryAddressStartIndex,
                }
            )
            await updateRecoveredAccounts(breadthWindowAccounts)
            temporaryAddressStartIndex += gapLimitProfileConfiguration.addressGapLimit
        }
    }
}

function hasOnlySearchedDepthWindow(): boolean {
    return currentSearchRound % NUM_SEARCH_ROUNDS_BEFORE_ACCOUNT_INCREMENT === 0
}

function updateRewardsFinderParameters(): void {
    const hasSearchedOnlyDepth = hasOnlySearchedDepthWindow()

    depthWindowAccountStartIndex = 0
    depthWindowAccountGapLimit += hasSearchedOnlyDepth ? 1 : 0
    depthWindowAddressStartIndex += gapLimitProfileConfiguration.addressGapLimit
    /**
     * NOTE: The address gap limit stays the same for the depth window,
     * so there is new assignment statement for its variable.
     */

    breadthWindowAccountStartIndex += hasSearchedOnlyDepth ? 1 : 0
    breadthWindowAccountGapLimit = 1
    breadthWindowAddressStartIndex = 0
    breadthWindowAddressGapLimit += gapLimitProfileConfiguration.addressGapLimit

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
