<script lang="typescript">
    import { Button, Checkbox, Icon, Illustration, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'
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
        estimateStakingAirdropReward, getAirdropFromEventId,
        getStakingEventFromAirdrop,
        getUnstakedFunds,
        isAccountPartiallyStaked,
    } from 'shared/lib/participation'
    import {
        accountToParticipate, partiallyStakedAccounts,
        participationAction,
        participationOverview,
        stakingEventState,
    } from 'shared/lib/participation/stores'
    import { Participation, ParticipationAction, StakingAirdrop } from 'shared/lib/participation/types'

    export let locale: Locale
    export let accountToStake: WalletAccount

    const isPartialStake = isAccountPartiallyStaked(accountToStake?.id)

    const getRewards = (airdrop: StakingAirdrop): string => <string>estimateStakingAirdropReward(
        StakingAirdrop[airdrop],
        isPartialStake ? getUnstakedFunds(accountToStake) : accountToStake?.rawIotaBalance,
        true
    )

    const activeAirdrops: StakingAirdrop[] =
        $participationOverview.find((apo) => apo.accountIndex === accountToStake.index)?.participations.map((p) => getAirdropFromEventId(p.eventId)) || []

    const airdropSelections: { [key in StakingAirdrop]: boolean } = {
        [StakingAirdrop.Assembly]: activeAirdrops?.length > 0 ? activeAirdrops?.includes(StakingAirdrop.Assembly) : true,
        [StakingAirdrop.Shimmer]: activeAirdrops?.length > 0 ? activeAirdrops?.includes(StakingAirdrop.Shimmer) : true,
    }

    const toggleAirdropSelection = (airdrop: StakingAirdrop): void => {
        airdropSelections[airdrop] = !airdropSelections[airdrop]
    }

    const handleBackClick = (): void => {
        openPopup({
            type: 'stakingManager',
        }, true)
    }

    const handleConfirmClick = (): void => {
        const _onConfirm = (): void => {
            accountToParticipate.set(accountToStake)
            participationAction.set(ParticipationAction.Stake)

            const selections = Object.keys(airdropSelections).filter((as) => airdropSelections[as])
            const participations: Participation[] = selections.map((selection) => (<Participation>{
                eventId: getStakingEventFromAirdrop(<StakingAirdrop>selection.toLowerCase())?.eventId,
                answers: [],
            }))
            openPopup({
                type: 'stakingManager',
                props: {
                    shouldParticipateOnMount: true,
                    participations,
                },
            }, true)
        }

        if ($isSoftwareProfile) {
            checkStronghold(_onConfirm)
        } else {
            if ($ledgerDeviceState !== LedgerDeviceState.Connected) {
                showAppNotification({
                    type: 'warning',
                    message: locale('error.ledger.appNotOpen')
                })
            } else {
                _onConfirm()
            }
        }
    }
</script>

<button
    on:click={handleBackClick}
    class="absolute top-6 left-8 text-gray-800 dark:text-white focus:text-blue-500"
>
    <Icon icon="chevron-left" />
</button>
<Text type="h3" classes="mb-2 text-center font-extrabold">{accountToStake.alias}</Text>
<div class="flex flex-col">
    <div class="absolute flex flex-col self-center text-center transform translate-y-16">
        <Text type="p" highlighted classes="text-lg">{locale('popups.stakingConfirmation.title')}</Text>
        <Text type="p" overrideColor classes="text-2xl font-extrabold text-gray-800">
            {isPartialStake ? formatUnitBestMatch(getUnstakedFunds(accountToStake)) : accountToStake.balance}
        </Text>
    </div>
    <Illustration illustration="staking-confirmation" classes="my-2 rounded-2xl" />
    <Text type="p" secondary classes="text-center mt-3 mb-6">
        {locale('popups.stakingConfirmation.body')}
    </Text>
</div>
<div class="flex flex-row justify-between items-center mb-6 space-x-2">
    {#each Object.keys(StakingAirdrop).map((sa) => sa.toLowerCase()) as airdrop}
        <div
            on:click={(activeAirdrops.length > 0 && activeAirdrops.includes(airdrop)) ? () => {} : () => toggleAirdropSelection(airdrop)}
            class="p-4 w-1/2 flex flex-col items-center text-center border border-1 border-solid border-gray-300 rounded-xl {activeAirdrops?.length && activeAirdrops?.includes(airdrop) ? 'cursor-default' : 'cursor-pointer hover:bg-blue-50 hover:border-blue-500 focus:border-blue-500 focus:bg-blue-50 dark:hover:bg-gray-800'}"
        >
            <div class="mb-2 flex flex-row justify-center">
                <Text type="p" disabled={!airdropSelections[airdrop] || (activeAirdrops.length > 0 && activeAirdrops.includes(airdrop))} classes="font-extrabold text-lg">{capitalize(airdrop)}&nbsp;</Text>
                <Text type="p" disabled={!airdropSelections[airdrop] || (activeAirdrops.length > 0 && activeAirdrops.includes(airdrop))} classes="text-lg inline">({STAKING_AIRDROP_TOKENS[airdrop]})</Text>
            </div>
            <Text type="p" secondary disabled={!airdropSelections[airdrop] || (activeAirdrops.length > 0 && activeAirdrops.includes(airdrop))}>{locale('popups.stakingConfirmation.estimatedAirdrop')}:</Text>
            <Checkbox bind:checked={airdropSelections[airdrop]} onClick={() => toggleAirdropSelection(airdrop)} disabled={(activeAirdrops.length > 0 && activeAirdrops.includes(airdrop))} classes="my-5" />
            <Text type="p" disabled={!airdropSelections[airdrop] || (activeAirdrops.length > 0 && activeAirdrops.includes(airdrop))} classes="font-bold text-lg">
                {(airdropSelections[airdrop] ? getRewards(capitalize(airdrop)) : estimateStakingAirdropReward(airdrop, 0, true, 0)).split(' ')[0]}
            </Text>
            <Text type="p" secondary disabled={!airdropSelections[airdrop] || (activeAirdrops.length > 0 && activeAirdrops.includes(airdrop))} classes="font-bold text-lg">
                {(airdropSelections[airdrop] ? getRewards(capitalize(airdrop)) : estimateStakingAirdropReward(airdrop, 0, true, 0)).split(' ')[1]}
            </Text>
        </div>
    {/each}
</div>
<Button
    classes="w-full"
    onClick={handleConfirmClick}
    disabled={!airdropSelections[StakingAirdrop.Assembly] && !airdropSelections[StakingAirdrop.Shimmer]}
>
    {locale('actions.confirm')}
</Button>
