<script lang="typescript">
    import { Button, Checkbox, Icon, Text, Tooltip } from 'shared/components'
    import { ledgerDeviceState } from 'shared/lib/ledger'
    import { showAppNotification } from 'shared/lib/notifications'
    import {
        canAccountReachMinimumAirdrop,
        estimateStakingAirdropReward,
        getAirdropFromEventId,
        getStakingEventFromAirdrop,
        getUnstakedFunds,
        isAccountPartiallyStaked,
    } from 'shared/lib/participation'
    import { STAKING_AIRDROP_TOKENS } from 'shared/lib/participation/constants'
    import { accountToParticipate, participationAction, participationOverview } from 'shared/lib/participation/stores'
    import { Participation, ParticipationAction, StakingAirdrop } from 'shared/lib/participation/types'
    import { openPopup } from 'shared/lib/popup'
    import { isSoftwareProfile } from 'shared/lib/profile'
    import { checkStronghold } from 'shared/lib/stronghold'
    import { Locale } from 'shared/lib/typings/i18n'
    import { LedgerDeviceState } from 'shared/lib/typings/ledger'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { capitalize } from 'shared/lib/utils'

    export let locale: Locale
    export let accountToStake: WalletAccount

    let tooltipAirdrop
    let showTooltip = false
    let tooltipAnchor: unknown
    const tooltipAnchors: { [airdrop: string]: unknown } = {}

    const toggleTooltip = (airdrop: string): void => {
        tooltipAirdrop = capitalize(airdrop)
        showTooltip = !showTooltip
        if (showTooltip) {
            tooltipAnchor = tooltipAnchors[airdrop]
        } else {
            tooltipAnchor = undefined
        }
    }

    const isPartialStake = isAccountPartiallyStaked(accountToStake?.id)

    const canReachAirdropMinimum = (airdrop: string) => canAccountReachMinimumAirdrop(accountToStake, airdrop)

    const getRewards = (airdrop: StakingAirdrop): string => {
        if (!canReachAirdropMinimum(airdrop)) return `0 ${STAKING_AIRDROP_TOKENS[airdrop]}`
        return <string>(
            estimateStakingAirdropReward(
                airdrop,
                isPartialStake ? getUnstakedFunds(accountToStake) : accountToStake?.rawIotaBalance,
                true
            )
        )
    }

    const activeAirdrops: StakingAirdrop[] =
        $participationOverview
            .find((apo) => apo.accountIndex === accountToStake.index)
            ?.participations.map((p) => getAirdropFromEventId(p.eventId)) || []

    const airdropSelections: { [key in StakingAirdrop]: boolean } = {
        [StakingAirdrop.Assembly]: canReachAirdropMinimum(StakingAirdrop.Assembly) ? true : false,
        [StakingAirdrop.Shimmer]: canReachAirdropMinimum(StakingAirdrop.Shimmer) ? true : false,
    }

    const toggleAirdropSelection = (airdrop: StakingAirdrop): void => {
        airdropSelections[airdrop] = !airdropSelections[airdrop]
    }

    const handleBackClick = (): void => {
        openPopup(
            {
                type: 'stakingManager',
            },
            true
        )
    }

    const handleConfirmClick = (): void => {
        const _onConfirm = (): void => {
            accountToParticipate.set(accountToStake)
            participationAction.set(ParticipationAction.Stake)

            const selections = !isPartialStake
                ? Object.keys(airdropSelections).filter((as) => airdropSelections[as])
                : activeAirdrops
            const participations: Participation[] = selections.map(
                (selection) =>
                    <Participation>{
                        eventId: getStakingEventFromAirdrop(<StakingAirdrop>selection.toLowerCase())?.eventId,
                        answers: [],
                    }
            )
            openPopup(
                {
                    type: 'stakingManager',
                    props: {
                        shouldParticipateOnMount: true,
                        participations,
                    },
                },
                true
            )
        }

        if ($isSoftwareProfile) {
            checkStronghold(_onConfirm)
        } else {
            if ($ledgerDeviceState !== LedgerDeviceState.Connected) {
                showAppNotification({
                    type: 'warning',
                    message: locale('error.ledger.appNotOpen'),
                })
            } else {
                _onConfirm()
            }
        }
    }

    const getAirdropParticipation = () => {
        if (activeAirdrops.length === 1) {
            return capitalize(activeAirdrops.join())
        } else {
            return activeAirdrops.map((a) => capitalize(a)).join(' & ')
        }
    }
</script>

<button on:click={handleBackClick} class="absolute top-6 left-8 text-gray-800 dark:text-white focus:text-blue-500">
    <Icon icon="chevron-left" />
</button>
<Text type="h3" classes="px-4 mb-4 text-center">{locale('popups.stakingConfirmation.title')}</Text>
<div class="rounded-2xl	flex flex-col space-y-1 self-center text-center p-5 bg-gray-100 dark:bg-gray-800">
    <Text type="p" highlighted bigger>
        {locale(`popups.stakingConfirmation.subtitle${isPartialStake ? 'Merge' : 'Stake'}`)}
    </Text>
    <Text type="h1">
        {isPartialStake ? formatUnitBestMatch(getUnstakedFunds(accountToStake)) : accountToStake.balance}
    </Text>
</div>
<Text type="p" secondary classes="text-center mt-5 mb-6">
    {locale(`popups.stakingConfirmation.body${isPartialStake ? 'Merge' : 'Stake'}`, {
        values: { airdrop: getAirdropParticipation() },
    })}
</Text>
{#if !isPartialStake}
    <div class="flex flex-row mb-6 space-x-2 flex-1">
        {#each Object.keys(StakingAirdrop).map((sa) => sa.toLowerCase()) as airdrop}
            <div
                on:click={!canReachAirdropMinimum(airdrop) ? () => {} : () => toggleAirdropSelection(airdrop)}
                class="airdrop-container p-4 w-1/2 flex flex-col items-center text-center border border-solid rounded-2xl {!canReachAirdropMinimum(
                    airdrop
                )
                    ? 'cursor-default'
                    : 'cursor-pointer hover:bg-blue-50 hover:border-blue-500 focus:border-blue-500 focus:bg-blue-50 dark:hover:bg-gray-800'} {!airdropSelections[
                    airdrop
                ] || !canReachAirdropMinimum(airdrop)
                    ? 'border-gray-300'
                    : 'border-blue-500'}"
            >
                <div class="mb-2 flex flex-row justify-center">
                    <Text type="p" bigger classes="font-extrabold">{capitalize(airdrop)}&nbsp;</Text>
                    <Text type="p" bigger>({STAKING_AIRDROP_TOKENS[airdrop]})</Text>
                </div>
                <Text type="p" secondary>{locale('popups.stakingConfirmation.estimatedAirdrop')}:</Text>
                {#if !canReachAirdropMinimum(airdrop)}
                    <div
                        class="py-5"
                        bind:this={tooltipAnchors[airdrop]}
                        on:mouseenter={() => toggleTooltip(airdrop)}
                        on:mouseleave={() => toggleTooltip(airdrop)}
                    >
                        <Icon icon="exclamation" width="26" height="26" classes="text-orange-500" />
                    </div>
                {:else}
                    <Checkbox
                        round
                        bind:checked={airdropSelections[airdrop]}
                        onClick={() => toggleAirdropSelection(airdrop)}
                        disabled={!canReachAirdropMinimum(airdrop)}
                        classes="my-5"
                    />
                {/if}
                <Text type="p" classes="font-bold text-lg w-full break-all">
                    {(airdropSelections[airdrop]
                        ? getRewards(airdrop)
                        : estimateStakingAirdropReward(airdrop, 0, true, 0)
                    ).split(' ')[0]}
                </Text>
                <Text type="p" secondary classes="font-bold text-lg">
                    {(airdropSelections[airdrop]
                        ? getRewards(airdrop)
                        : estimateStakingAirdropReward(airdrop, 0, true, 0)
                    ).split(' ')[1]}
                </Text>
            </div>
        {/each}
    </div>
{/if}
<Button
    classes="w-full"
    onClick={handleConfirmClick}
    disabled={!airdropSelections[StakingAirdrop.Assembly] && !airdropSelections[StakingAirdrop.Shimmer]}
>
    {locale('actions.confirm')}
</Button>

{#if showTooltip}
    <Tooltip anchor={tooltipAnchor} position="right">
        <Text type="p" classes="text-gray-900 bold mb-1 text-left">
            {locale('tooltips.stakingMinRewards.title')}
        </Text>
        <Text type="p" secondary classes="text-left"
            >{locale('tooltips.stakingMinRewards.bodyMinBalanceAirdrop', { values: { airdrop: tooltipAirdrop } })}</Text
        >
    </Tooltip>
{/if}
