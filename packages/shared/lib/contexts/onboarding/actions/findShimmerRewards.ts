/* eslint-disable no-console */

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
import { IAccount } from '@core/account'

/**
 * NOTE: This variable is unitialized because we
 * must know the profile type to be able to determine
 * gap limits that are sensible in terms of UX.
 */
let gapLimitProfileConfiguration: GapLimitProfileConfiguration

let depthWindowAccountStartIndex = -1
let depthWindowAccountGapLimit = -1
let depthWindowAddressStartIndex = -1
let depthWindowAddressGapLimit = -1

let breadthWindowAccountStartIndex = -1
let breadthWindowAccountGapLimit = -1
let breadthWindowAddressStartIndex = -1
let breadthWindowAddressGapLimit = -1

let totalUnclaimedShimmerRewards = 0

let currentSearchCount = 0

// parameterize every 2, 3, n rounds
// handle errors from await functions, where and how to handle
// consider making parameters into an object

export async function findShimmerRewards(): Promise<void> {
    resetGapLimitConfiguration()

    const recoveredAccounts = await recoverAccountsInSeries()
    await updateRecoveredAccounts(recoveredAccounts)

    updateRewardsFinderParameters()
}

async function recoverAccountsInSeries(): Promise<IAccount[]> {
    const _shimmerClaimingProfileManager = get(shimmerClaimingProfileManager)

    console.log('SEARCH COUNT: ', currentSearchCount)
    console.log('\n')

    console.log('DEPTH WINDOW ACCOUNT START INDEX: ', depthWindowAccountStartIndex)
    console.log('DEPTH WINDOW ACCOUNT GAP LIMIT: ', depthWindowAccountGapLimit)
    console.log('DEPTH WINDOW ADDRESS START INDEX: ', depthWindowAddressStartIndex)
    console.log('DEPTH WINDOW ADDRESS GAP LIMIT: ', depthWindowAddressGapLimit)
    const depthWindowSearchSpace =
        (depthWindowAccountGapLimit - depthWindowAccountStartIndex) * depthWindowAddressGapLimit
    console.log(
        'DEPTH WINDOW SEARCH SPACE: ',
        `(${depthWindowAccountGapLimit} - ${depthWindowAccountStartIndex}) * (${depthWindowAddressGapLimit})`,
        depthWindowSearchSpace
    )
    console.log('\n')

    const depthWindowAccounts = await _shimmerClaimingProfileManager?.recoverAccounts(
        depthWindowAccountStartIndex,
        depthWindowAccountGapLimit,
        depthWindowAddressGapLimit,
        {
            ...SHIMMER_CLAIMING_ACCOUNT_SYNC_OPTIONS,
            addressStartIndex: depthWindowAddressStartIndex,
        }
    )

    let breadthWindowAccounts: IAccount[] = []
    if (hasOnlySearchedDepthWindow()) {
        console.log('BREADTH WINDOW ACCOUNT START INDEX: ', breadthWindowAccountStartIndex)
        console.log('BREADTH WINDOW ACCOUNT GAP LIMIT: ', breadthWindowAccountGapLimit)
        console.log('BREADTH WINDOW ADDRESS START INDEX: ', breadthWindowAddressStartIndex)
        console.log('BREADTH WINDOW ADDRESS GAP LIMIT: ', breadthWindowAddressGapLimit)
        const breadthWindowSearchSpace =
            breadthWindowAccountGapLimit * (breadthWindowAddressGapLimit - breadthWindowAddressStartIndex)
        console.log(
            'BREADTH WINDOW SEARCH SPACE: ',
            `(${breadthWindowAccountGapLimit}) * (${breadthWindowAddressGapLimit} - ${breadthWindowAddressStartIndex})`,
            breadthWindowSearchSpace
        )
        console.log('\n')
        breadthWindowAccounts = await _shimmerClaimingProfileManager?.recoverAccounts(
            breadthWindowAccountStartIndex,
            breadthWindowAccountGapLimit,
            breadthWindowAddressGapLimit,
            {
                ...SHIMMER_CLAIMING_ACCOUNT_SYNC_OPTIONS,
                addressStartIndex: breadthWindowAddressStartIndex,
            }
        )
    }
    return depthWindowAccounts
        .concat(breadthWindowAccounts)
        .filter((account, idx, arr) => idx === arr.findIndex((_account) => _account.meta.index === account.meta.index))
}

function hasOnlySearchedDepthWindow(): boolean {
    return currentSearchCount !== 0 && currentSearchCount % 2 === 0
}

function updateRewardsFinderParameters(): void {
    const hasSearchedOnlyDepth = hasOnlySearchedDepthWindow()

    depthWindowAccountStartIndex = 0
    depthWindowAccountGapLimit += hasSearchedOnlyDepth ? 1 : 0
    depthWindowAddressStartIndex += gapLimitProfileConfiguration.addressGapLimit
    /* eslint-disable-next-line no-self-assign */
    depthWindowAddressGapLimit = depthWindowAddressGapLimit

    breadthWindowAccountStartIndex += hasSearchedOnlyDepth ? 1 : 0
    breadthWindowAccountGapLimit = 1
    breadthWindowAddressStartIndex = 0
    breadthWindowAddressGapLimit += gapLimitProfileConfiguration.addressGapLimit

    currentSearchCount++
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

function resetGapLimitConfiguration(): void {
    if (gapLimitProfileConfiguration) {
        const profileType = get(onboardingProfile)?.type
        const hasMismatchedProfileType =
            gapLimitProfileConfiguration.accountGapLimit !==
                SHIMMER_CLAIMING_GAP_LIMIT_CONFIGURATION[profileType].accountGapLimit ||
            gapLimitProfileConfiguration.addressGapLimit !==
                SHIMMER_CLAIMING_GAP_LIMIT_CONFIGURATION[profileType].addressGapLimit
        if (hasMismatchedProfileType) {
            initialiseGapLimitConfiguration()
        }
    } else {
        initialiseGapLimitConfiguration()
    }
}

function initialiseGapLimitConfiguration(): void {
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
    breadthWindowAccountGapLimit = gapLimitProfileConfiguration.accountGapLimit
    breadthWindowAddressStartIndex = 0
    breadthWindowAddressGapLimit = gapLimitProfileConfiguration.addressGapLimit
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
