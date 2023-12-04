<script lang="ts">
    import { Icon, Text, Tile, FontWeight, TextType } from 'shared/components'
    import { localize } from '@core/i18n'
    import { formatTokenAmountBestMatch } from '@core/wallet/utils'
    import { IShimmerClaimingWallet, ShimmerClaimingWalletState } from '@contexts/onboarding'
    import { IBaseToken } from '@core/wallet/interfaces'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let shimmerClaimingAccount: IShimmerClaimingWallet
    export let baseToken: IBaseToken

    $: shouldDisplayFailedState = shimmerClaimingAccount?.state === ShimmerClaimingWalletState.Failed
    $: shouldDisplayUnclaimedRewards = shimmerClaimingAccount?.state !== ShimmerClaimingWalletState.FullyClaimed
    $: shouldDisplayClaimedRewards =
        shimmerClaimingAccount?.state !== ShimmerClaimingWalletState.UnclaimedWithRewards &&
        shimmerClaimingAccount?.state !== ShimmerClaimingWalletState.UnclaimedWithoutRewards
</script>

{#if shimmerClaimingAccount}
    <Tile isGhost classes="rounded-xl">
        <div class="w-full flex flex-row justify-between items-center space-x-4">
            <div class="flex flex-row items-center text-left space-x-2">
                <Icon icon={IconEnum.Wallet} width={28} height={28} classes="text-blue-500" />
                <Text type={TextType.p} fontWeight={FontWeight.medium}>
                    {shimmerClaimingAccount?.getMetadata()?.alias}
                </Text>
            </div>
            <div class="flex flex-col">
                {#if shimmerClaimingAccount?.state === ShimmerClaimingWalletState.Claiming}
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
                                    icon={IconEnum.StatusError}
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
                                icon={IconEnum.SuccessCheck}
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
