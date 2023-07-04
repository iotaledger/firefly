<script lang="ts">
    import { Icon, Text, Tile, FontWeight, TextType } from 'shared/components'
    import { localize } from '@core/i18n'
    import { formatTokenAmountBestMatch } from '@core/wallet/utils'
    import { IShimmerClaimingAccount, ShimmerClaimingAccountState } from '@contexts/onboarding'
    import { IBaseToken } from '@core/wallet/interfaces'

    export let shimmerClaimingAccount: IShimmerClaimingAccount
    export let baseToken: IBaseToken

    $: shouldDisplayFailedState = shimmerClaimingAccount?.state === ShimmerClaimingAccountState.Failed
    $: shouldDisplayUnclaimedRewards = shimmerClaimingAccount?.state !== ShimmerClaimingAccountState.FullyClaimed
    $: shouldDisplayClaimedRewards =
        shimmerClaimingAccount?.state !== ShimmerClaimingAccountState.UnclaimedWithRewards &&
        shimmerClaimingAccount?.state !== ShimmerClaimingAccountState.UnclaimedWithoutRewards
</script>

{#if shimmerClaimingAccount}
    <Tile isGhost classes="rounded-xl">
        <div class="w-full flex flex-row justify-between items-center space-x-4">
            <div class="flex flex-row items-center text-left space-x-2">
                <Icon icon="wallet" width={28} height={28} classes="text-blue-500" />
                <Text type={TextType.p} fontWeight={FontWeight.medium}>
                    {shimmerClaimingAccount?.getMetadata()?.alias}
                </Text>
            </div>
            <div class="flex flex-col">
                {#if shimmerClaimingAccount?.state === ShimmerClaimingAccountState.Claiming}
                    <Text type={TextType.p} secondary fontWeight={FontWeight.semibold}>
                        {`${localize('actions.claimingRewards')}...`}
                    </Text>
                {:else}
                    {#if shouldDisplayUnclaimedRewards}
                        <div class="flex flex-row justify-end items-center text-right space-x-2">
                            {#if shouldDisplayFailedState}
                                <Icon
                                    width="16"
                                    height="16"
                                    icon="status-error"
                                    classes="text-white bg-red-500 rounded-full"
                                />
                            {/if}
                            <Text type={TextType.p} fontWeight={FontWeight.semibold}>
                                {formatTokenAmountBestMatch(shimmerClaimingAccount?.unclaimedRewards, baseToken)}
                            </Text>
                        </div>
                    {/if}
                    {#if shouldDisplayClaimedRewards && !shouldDisplayFailedState}
                        <div class="flex flex-row justify-end items-center text-right space-x-2">
                            <Icon
                                width="16"
                                height="16"
                                icon="success-check"
                                classes="text-white bg-green-600 rounded-full"
                            />
                            <Text type={TextType.p} fontWeight={FontWeight.semibold} secondary classes="flex-grow">
                                {localize('general.amountClaimed', {
                                    values: {
                                        amount: formatTokenAmountBestMatch(
                                            shimmerClaimingAccount?.claimedRewards,
                                            baseToken
                                        ),
                                    },
                                })}
                            </Text>
                        </div>
                    {/if}
                {/if}
            </div>
        </div>
    </Tile>
{/if}
