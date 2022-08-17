<script lang="typescript">
    import { selectedAccount } from '@core/account'
    import { Button, Checkbox, Icon, Text, Tooltip } from 'shared/components'
    import { ledgerDeviceStatus, LedgerConnectionState } from '@core/ledger'
    import { showAppNotification } from 'shared/lib/notifications'
    import {
        canAccountReachMinimumAirdrop,
        estimateStakingAirdropReward,
        getAirdropFromEventId,
        getAvailableAirdrops,
        getStakingEventFromAirdrop,
        getUnstakedFunds,
    } from 'shared/lib/participation'
    import { STAKING_AIRDROP_TOKENS, STAKING_EVENT_IDS } from 'shared/lib/participation/constants'
    import { participationAction, isPartiallyStaked } from 'shared/lib/participation/stores'
    import { Participation, ParticipationAction, StakingAirdrop } from 'shared/lib/participation/types'
    import { openPopup } from 'shared/lib/popup'
    import { isSoftwareProfile } from '@core/profile'
    import { checkStronghold } from 'shared/lib/stronghold'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { capitalize } from 'shared/lib/utils'
    import { localize } from '@core/i18n'

    let tooltipAirdrop: string
    let showTooltip = false
    let tooltipAnchor: unknown

    // Removed to hardcode event ids for now, as we only have 1 event running and this doesn't work for restoring.
    /* const activeAirdropsParticipatedIn =
        $selectedAccountParticipationOverview?.participations
            .map((p) => getAirdropFromEventId(p.eventId))
            // Falsy values (undefined, null, ...) are filtered out from the array
            .filter(Boolean) || [] */

    // Hardcode to the current event ids for now, and this allows us to merge after restoring
    const activeAirdropsParticipatedIn =
        STAKING_EVENT_IDS.map((eventId) => getAirdropFromEventId(eventId))
            // Falsy values (undefined, null, ...) are filtered out from the array
            .filter(Boolean) || []

    const availableAirdrops = getAvailableAirdrops()

    const airdropSelections: { [key in StakingAirdrop]: boolean } = {
        [StakingAirdrop.Assembly]:
            availableAirdrops.includes(StakingAirdrop.Assembly) && canReachAirdropMinimum(StakingAirdrop.Assembly),
        [StakingAirdrop.Shimmer]:
            availableAirdrops.includes(StakingAirdrop.Shimmer) && canReachAirdropMinimum(StakingAirdrop.Shimmer),
    }

    const tooltipAnchors: { [airdrop: string]: unknown } = {}

    function toggleTooltip(airdrop: StakingAirdrop): void {
        tooltipAirdrop = capitalize(airdrop)
        showTooltip = !showTooltip
        if (showTooltip) {
            tooltipAnchor = tooltipAnchors[airdrop]
        } else {
            tooltipAnchor = undefined
        }
    }

    function canReachAirdropMinimum(airdrop: StakingAirdrop): boolean {
        return canAccountReachMinimumAirdrop($selectedAccount, airdrop)
    }

    function getRewards(airdrop: StakingAirdrop): string {
        if (!canReachAirdropMinimum(airdrop)) {
            return `0 ${STAKING_AIRDROP_TOKENS[airdrop]}`
        }
        return estimateStakingAirdropReward(
            airdrop,
            $isPartiallyStaked ? getUnstakedFunds() : $selectedAccount?.balances.baseCoin.available,
            true
        )
    }

    function toggleAirdropSelection(airdrop: StakingAirdrop): void {
        airdropSelections[airdrop] = !airdropSelections[airdrop]
    }

    function handleBackClick(): void {
        openPopup(
            {
                type: 'stakingManager',
            },
            true
        )
    }

    function handleConfirmClick(): void {
        if ($isSoftwareProfile) {
            void checkStronghold(openStakingManager)
        } else {
            if ($ledgerDeviceStatus.connectionState !== LedgerConnectionState.Connected) {
                showAppNotification({
                    type: 'warning',
                    message: localize('error.ledger.appNotOpen'),
                })
            } else {
                openStakingManager()
            }
        }
    }

    function openStakingManager(): void {
        participationAction.set(ParticipationAction.Stake)

        const selections = !$isPartiallyStaked
            ? Object.keys(airdropSelections).filter((as) => airdropSelections[as])
            : activeAirdropsParticipatedIn

        const participations = selections.map(
            (selection): Participation => ({
                eventId: getStakingEventFromAirdrop(selection.toLowerCase() as StakingAirdrop)?.eventId,
                answers: [],
            })
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

    function getAirdropParticipation(): string {
        if (activeAirdropsParticipatedIn.length === 1) {
            return capitalize(activeAirdropsParticipatedIn.join())
        } else {
            return activeAirdropsParticipatedIn.map((a) => capitalize(a)).join(' & ')
        }
    }

    function showInfoText() {
        return $isPartiallyStaked || availableAirdrops.length > 1
    }
</script>

<button on:click={handleBackClick} class="absolute top-6 left-8 text-gray-800 dark:text-white focus:text-blue-500">
    <Icon icon="chevron-left" />
</button>
<Text type="h3" classes="px-4 mb-4 text-center">{localize('popups.stakingConfirmation.title')}</Text>
<div class="rounded-2xl	flex flex-col space-y-1 self-center text-center p-5 bg-gray-100 dark:bg-gray-800">
    <Text type="p" highlighted bigger>
        {localize(`popups.stakingConfirmation.subtitle${$isPartiallyStaked ? 'Merge' : 'Stake'}`)}
    </Text>
    <Text type="h1">
        {$isPartiallyStaked ? formatUnitBestMatch(getUnstakedFunds()) : $selectedAccount?.balances?.baseCoin.available}
    </Text>
</div>
{#if showInfoText()}
    <Text type="p" secondary classes="text-center mt-5">
        {$isPartiallyStaked
            ? localize('popups.stakingConfirmation.mergeStakeWarning', {
                  values: { airdrop: getAirdropParticipation() },
              })
            : localize('popups.stakingConfirmation.multiAirdropWarning')}
    </Text>
{/if}
{#if !$isPartiallyStaked}
    <div class="flex flex-row mt-6 space-x-2 flex-1">
        {#each Object.values(availableAirdrops) as airdrop}
            <div
                on:click={!canReachAirdropMinimum(airdrop) || availableAirdrops.length <= 1
                    ? () => {}
                    : () => toggleAirdropSelection(airdrop)}
                class="airdrop-container p-4 w-1/2 flex flex-1 flex-col items-center text-center border border-solid rounded-2xl {!canReachAirdropMinimum(
                    airdrop
                )
                    ? 'cursor-default'
                    : availableAirdrops.length <= 1
                    ? 'cursor-default border-blue-500'
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
                <Text type="p" secondary>{localize('popups.stakingConfirmation.estimatedAirdrop')}:</Text>
                {#if !canReachAirdropMinimum(airdrop)}
                    <div
                        class="py-5"
                        bind:this={tooltipAnchors[airdrop]}
                        on:mouseenter={() => toggleTooltip(airdrop)}
                        on:mouseleave={() => toggleTooltip(airdrop)}
                    >
                        <Icon icon="exclamation" width="26" height="26" classes="text-orange-500" />
                    </div>
                {:else if availableAirdrops.length > 1}
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
    classes="w-full mt-6"
    onClick={handleConfirmClick}
    disabled={!airdropSelections[StakingAirdrop.Assembly] && !airdropSelections[StakingAirdrop.Shimmer]}
>
    {localize('actions.confirm')}
</Button>

{#if showTooltip}
    <Tooltip anchor={tooltipAnchor} position="right">
        <Text type="p" classes="text-gray-900 bold mb-1 text-left">
            {localize('tooltips.stakingMinRewards.title')}
        </Text>
        <Text type="p" secondary classes="text-left"
            >{localize('tooltips.stakingMinRewards.bodyMinBalanceAirdrop', {
                values: { airdrop: tooltipAirdrop },
            })}</Text
        >
    </Tooltip>
{/if}
