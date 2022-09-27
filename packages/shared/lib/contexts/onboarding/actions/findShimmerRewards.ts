/* eslint-disable no-console */

import { IAccount } from '@core/account'
import { BASE_TOKEN, NetworkProtocol } from '@core/network'
import { RecoverAccountsProfileConfiguration, UnableToFindProfileTypeError } from '@core/profile'
import { zip } from '@core/utils'
import { formatTokenAmountBestMatch } from '@core/wallet'
import { showAppNotification } from '@lib/notifications'
import { get } from 'svelte/store'
import { SHIMMER_CLAIMING_ACCOUNT_SYNC_OPTIONS, SHIMMER_CLAIMING_RECOVER_ACCOUNTS_CONFIGURATION } from '../constants'
import { getSortedRenamedBoundAccounts, prepareShimmerClaimingAccount } from '../helpers'
import { onboardingProfile, shimmerClaimingProfileManager, updateShimmerClaimingAccount } from '../stores'
import { sumTotalUnclaimedRewards } from '../utils'

const DEPTH_SEARCH_ACCOUNT_START_INDEX = 0
const INITIAL_SEARCH_ADDRESS_START_INDEX = 0
const INITIAL_SEARCH_ROUND = 1
const INITIAL_TOTAL_UNCLAIMED_REWARDS = 0

/**
 * NOTE: This variable is uninitialized because we
 * must know the profile type to be able to determine
 * gap limits that are sensible in terms of UX.
 */
let recoverAccountsProfileConfiguration: RecoverAccountsProfileConfiguration

let depthSearchAccountGapLimit: number
let depthSearchAddressStartIndex: number
let depthSearchAddressGapLimit: number

let breadthSearchAccountStartIndex: number
let breadthSearchAddressGapLimit: number

let totalUnclaimedShimmerRewards: number
let currentSearchRound: number

export function initialiseRecoverAccountsConfiguration(): void {
    const profileType = get(onboardingProfile)?.type
    if (!profileType) {
        throw new UnableToFindProfileTypeError()
    }

    recoverAccountsProfileConfiguration = SHIMMER_CLAIMING_RECOVER_ACCOUNTS_CONFIGURATION[profileType]

    depthSearchAccountGapLimit = recoverAccountsProfileConfiguration.initialAccountRange
    depthSearchAddressStartIndex = INITIAL_SEARCH_ADDRESS_START_INDEX
    depthSearchAddressGapLimit = recoverAccountsProfileConfiguration.addressGapLimit

    breadthSearchAccountStartIndex = recoverAccountsProfileConfiguration.initialAccountRange
    breadthSearchAddressGapLimit = recoverAccountsProfileConfiguration.addressGapLimit

    currentSearchRound = INITIAL_SEARCH_ROUND
    totalUnclaimedShimmerRewards = INITIAL_TOTAL_UNCLAIMED_REWARDS
}

export async function findShimmerRewards(): Promise<void> {
    await depthSearchAndRecoverAccounts()

    if (hasOnlyDoneDepthSearch()) {
        await breadthSearchAndRecoverAccounts()
    }

    updateRewardsFinderParameters()
}

async function depthSearchAndRecoverAccounts(): Promise<void> {
    console.log('DEPTH SEARCH ACCOUNT START IDX: ', DEPTH_SEARCH_ACCOUNT_START_INDEX)
    console.log('DEPTH SEARCH ACCOUNT GL: ', depthSearchAccountGapLimit)
    console.log('DEPTH SEARCH ADDRESS START IDX: ', depthSearchAddressStartIndex)
    console.log('DEPTH SEARCH ADDRESS GL: ', depthSearchAddressGapLimit)
    console.log('\n')

    const profileManager = get(shimmerClaimingProfileManager)
    const depthSearchAccounts = await profileManager?.recoverAccounts(
        DEPTH_SEARCH_ACCOUNT_START_INDEX,
        depthSearchAccountGapLimit,
        depthSearchAddressGapLimit,
        {
            ...SHIMMER_CLAIMING_ACCOUNT_SYNC_OPTIONS,
            addressStartIndex: depthSearchAddressStartIndex,
            addressStartIndexInternal: depthSearchAddressStartIndex,
        }
    )

    await updateRecoveredAccounts(depthSearchAccounts)
}

async function breadthSearchAndRecoverAccounts(): Promise<void> {
    const profileManager = get(shimmerClaimingProfileManager)
    const { accountGapLimit, addressGapLimit } = recoverAccountsProfileConfiguration
    console.log('BREADTH SEARCH ACCOUNT START IDX: ', breadthSearchAccountStartIndex)
    console.log('BREADTH SEARCH ACCOUNT GL: ', accountGapLimit)
    console.log('BREADTH SEARCH ADDRESS GL: ', addressGapLimit)
    for (
        let chunkAddressStartIndex = INITIAL_SEARCH_ADDRESS_START_INDEX;
        chunkAddressStartIndex < breadthSearchAddressGapLimit;
        chunkAddressStartIndex += addressGapLimit
    ) {
        console.log('CHUNK ADDRESS START IDX: ', chunkAddressStartIndex)
        const breadthSearchAccounts = await profileManager?.recoverAccounts(
            breadthSearchAccountStartIndex,
            accountGapLimit,
            addressGapLimit,
            {
                ...SHIMMER_CLAIMING_ACCOUNT_SYNC_OPTIONS,
                addressStartIndex: chunkAddressStartIndex,
                addressStartIndexInternal: chunkAddressStartIndex,
            }
        )
        await updateRecoveredAccounts(breadthSearchAccounts)
    }
    console.log('\n')
}

function hasOnlyDoneDepthSearch(): boolean {
    const { numberOfRoundsBetweenBreadthSearch } = recoverAccountsProfileConfiguration
    return currentSearchRound % numberOfRoundsBetweenBreadthSearch === 0
}

function updateRewardsFinderParameters(): void {
    const hasSearchedOnlyDepth = hasOnlyDoneDepthSearch()

    const { accountGapLimit, addressGapLimit } = recoverAccountsProfileConfiguration

    depthSearchAccountGapLimit += hasSearchedOnlyDepth ? accountGapLimit : 0
    depthSearchAddressStartIndex += addressGapLimit

    breadthSearchAccountStartIndex += hasSearchedOnlyDepth ? accountGapLimit : 0
    breadthSearchAddressGapLimit += addressGapLimit

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
