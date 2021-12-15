<script lang="typescript">
    import { Button, Checkbox, Icon, Text } from 'shared/components'
    import type { Locale } from 'shared/lib/typings/i18n'
    import { ledgerDeviceState } from 'shared/lib/ledger'
    import { LedgerDeviceState } from 'shared/lib/typings/ledger'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import { isSoftwareProfile } from 'shared/lib/profile'
    import { checkStronghold } from 'shared/lib/stronghold'
    import type { WalletAccount } from 'shared/lib/typings/wallet'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { capitalize } from 'shared/lib/utils'

    import { STAKING_AIRDROP_TOKENS } from 'shared/lib/participation/constants'
    import {
        estimateStakingAirdropReward,
        getAirdropFromEventId,
        getStakingEventFromAirdrop,
        getUnstakedFunds,
        isAccountPartiallyStaked,
    } from 'shared/lib/participation'
    import { accountToParticipate, participationAction, participationOverview } from 'shared/lib/participation/stores'
    import { Participation, ParticipationAction, StakingAirdrop } from 'shared/lib/participation/types'

    export let locale: Locale
    export let accountToStake: WalletAccount

    const isPartialStake = isAccountPartiallyStaked(accountToStake?.id)

    const getRewards = (airdrop: StakingAirdrop): string =>
        <string>(
            estimateStakingAirdropReward(
                StakingAirdrop[airdrop],
                isPartialStake ? getUnstakedFunds(accountToStake) : accountToStake?.rawIotaBalance,
                true
            )
        )

    const activeAirdrops: StakingAirdrop[] =
        $participationOverview
            .find((apo) => apo.accountIndex === accountToStake.index)
            ?.participations.map((p) => getAirdropFromEventId(p.eventId)) || []

    const airdropSelections: { [key in StakingAirdrop]: boolean } = {
        [StakingAirdrop.Assembly]:
            activeAirdrops?.length > 0 ? activeAirdrops?.includes(StakingAirdrop.Assembly) : true,
        [StakingAirdrop.Shimmer]: activeAirdrops?.length > 0 ? activeAirdrops?.includes(StakingAirdrop.Shimmer) : true,
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

            const selections = Object.keys(airdropSelections).filter((as) => airdropSelections[as])
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
            return activeAirdrops.map(a => capitalize(a)).join(' & ')
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
                on:click={(activeAirdrops.length > 0 && activeAirdrops.includes(airdrop)) ? () => {} : () => toggleAirdropSelection(airdrop)}
                class="p-4 w-1/2 flex flex-col items-center text-center border border-1 border-solid rounded-2xl {activeAirdrops?.length && activeAirdrops?.includes(airdrop) ? 'cursor-default' : 'cursor-pointer hover:bg-blue-50 hover:border-blue-500 focus:border-blue-500 focus:bg-blue-50 dark:hover:bg-gray-800'} {!airdropSelections[airdrop] || (activeAirdrops.length > 0 && activeAirdrops.includes(airdrop)) ? 'opacity-50 border-gray-300' : 'border-blue-500'}"
            >
                <div class="mb-2 flex flex-row justify-center">
                    <Text type="p" bigger classes="font-extrabold">{capitalize(airdrop)}&nbsp;</Text>
                    <Text type="p" bigger>({STAKING_AIRDROP_TOKENS[airdrop]})</Text>
                </div>
                <Text type="p" secondary>{locale('popups.stakingConfirmation.estimatedAirdrop')}:</Text>
                <Checkbox round bind:checked={airdropSelections[airdrop]} onClick={() => toggleAirdropSelection(airdrop)} disabled={(activeAirdrops.length > 0 && activeAirdrops.includes(airdrop))} classes="my-5" />
                <Text type="p" classes="font-bold text-lg w-full break-all">
                    {(airdropSelections[airdrop] ? getRewards(capitalize(airdrop)) : estimateStakingAirdropReward(airdrop, 0, true, 0)).split(' ')[0]}
                </Text>
                <Text type="p" secondary classes="font-bold text-lg">
                    {(airdropSelections[airdrop] ? getRewards(capitalize(airdrop)) : estimateStakingAirdropReward(airdrop, 0, true, 0)).split(' ')[1]}
                </Text>
            </div>
        {/each}
    </div>
{/if}
<Button
    classes="w-full"
    onClick={handleConfirmClick}
    disabled={!airdropSelections[StakingAirdrop.Assembly] && !airdropSelections[StakingAirdrop.Shimmer]}>
    {locale('actions.confirm')}
</Button>
