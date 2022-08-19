import { get } from 'svelte/store'

import { getBoundAccount } from '@core/account'
import { BASE_TOKEN, NetworkProtocol } from '@core/network'
import { INITIAL_ACCOUNT_GAP_LIMIT, INITIAL_ADDRESS_GAP_LIMIT, UnableToFindProfileTypeError } from '@core/profile'
import { profileManager } from '@core/profile-manager'
import { sortAccountsByIndex, zip } from '@core/utils'
import { formatTokenAmountBestMatch } from '@core/wallet'
import { showAppNotification } from '@lib/notifications'

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
        const accountMetadatas = await _shimmerClaimingProfileManager?.recoverAccounts(accountGapLimit, addressGapLimit)
        const boundAccounts = (
            await Promise.all(
                accountMetadatas.map((metadata) =>
                    getBoundAccount(metadata?.index, true, shimmerClaimingProfileManager)
                )
            )
        ).sort(sortAccountsByIndex)
        const updatedTotalUnclaimedShimmerRewards = await sumTotalUnclaimedRewards(boundAccounts)
        const wereRewardsFound = updatedTotalUnclaimedShimmerRewards > totalUnclaimedShimmerRewards
        if (wereRewardsFound) {
            // notify user
            // -------
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

            // update onboarding profile
            // -------
            const boundTwinAccounts = (
                await Promise.all(
                    boundAccounts.map((boundAccount) =>
                        getBoundAccount(boundAccount?.meta?.index, true, profileManager)
                    )
                )
            ).sort(sortAccountsByIndex)
            for (const [boundAccount, boundTwinAccount] of zip(boundAccounts, boundTwinAccounts)) {
                const shimmerClaimingAccount = await prepareShimmerClaimingAccount(boundAccount, boundTwinAccount)
                updateShimmerClaimingAccount(shimmerClaimingAccount)
            }

            // reset reward finding parameters
            // -------
            totalUnclaimedShimmerRewards = updatedTotalUnclaimedShimmerRewards

            // reset gap limits
            accountGapLimit = accountGapLimitIncrement
            addressGapLimit = addressGapLimitIncrement

            // TODO: add logic to get highest account and address indices with funds
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

function setGapLimitIncrements(): void {
    const profileType = get(onboardingProfile)?.type
    if (!profileType) {
        throw new UnableToFindProfileTypeError()
    }

    accountGapLimitIncrement = INITIAL_ACCOUNT_GAP_LIMIT[profileType]
    addressGapLimitIncrement = INITIAL_ADDRESS_GAP_LIMIT[profileType]

    haveGapLimitIncrementsBeenSet = true
}
