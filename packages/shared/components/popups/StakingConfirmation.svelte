<script lang="typescript">
    import { Button, Illustration, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { ledgerDeviceState } from 'shared/lib/ledger'
    import { LedgerDeviceState } from 'shared/lib/typings/ledger'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import { isSoftwareProfile } from 'shared/lib/profile'
    import { checkStronghold } from 'shared/lib/stronghold'
    import type { WalletAccount } from 'shared/lib/typings/wallet'
    import { formatUnitBestMatch } from 'shared/lib/units'

    import { STAKING_AIRDROP_TOKENS } from 'shared/lib/participation/constants'
    import { estimateStakingAirdropReward, isAccountPartiallyStaked } from 'shared/lib/participation'
    import { accountToParticipate, participationAction } from 'shared/lib/participation/stores'
    import { ParticipationAction, StakingAirdrop } from 'shared/lib/participation/types'

    export let accountToStake: WalletAccount

    const getRewards = (airdrop: StakingAirdrop): [string, string] => {
        const rewards = estimateStakingAirdropReward(StakingAirdrop[airdrop], accountToStake?.rawIotaBalance, true)
        return (rewards as string).split(' ')
    }

    const isPartialStake = isAccountPartiallyStaked(accountToStake?.id)

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

            openPopup({
                type: 'stakingManager',
                props: {
                    shouldParticipateOnMount: true
                },
            }, true)
        }

        if ($isSoftwareProfile) {
            checkStronghold(_onConfirm)
        } else {
            if ($ledgerDeviceState !== LedgerDeviceState.Connected) {
                showAppNotification({
                    type: 'warning',
                    message: localize('error.ledger.appNotOpen')
                })
            } else {
                _onConfirm()
            }
        }
    }
</script>

<div class="mb-2 w-full flex flex-row justify-between items-start">
    <div on:click={handleBackClick} class="cursor-pointer">
        <Text type="p" classes="text-xl font-extrabold">←</Text>
    </div>
    <Text type="h3" classes="text-center font-extrabold">{accountToStake.alias}</Text>
    <Text />
</div>
<div class="flex flex-col">
    <div class="absolute flex flex-col self-center text-center transform translate-y-28">
        <Text type="p" highlighted classes="text-lg">{localize('views.staking.confirmation.title')}</Text>
        <Text type="p" overrideColor classes="text-2xl font-extrabold text-gray-800">
            {isPartialStake ? formatUnitBestMatch(getUnstakedFunds(accountToStake)) : accountToStake.balance}
        </Text>
    </div>
    <Illustration illustration="staking-confirmation" classes="mt-2 mb-6" />
</div>
<div class="flex flex-row mb-6 space-x-2">
    {#each Object.keys(StakingAirdrop) as airdrop}
        <div class="p-4 text-center border border-1 border-solid border-gray-300 rounded-xl">
            <div class="mb-2 flex flex-row justify-center">
                <Text type="p" classes="font-extrabold text-lg">{airdrop}</Text>
                <Text type="p" classes="ml-1 text-lg">({STAKING_AIRDROP_TOKENS[airdrop.toLowerCase()]})</Text>
            </div>
            <Text type="p" secondary classes="mb-4">{localize('views.staking.confirmation.body')}</Text>
            <div class="flex flex-col">
                <Text type="p" classes="font-bold text-xl inline">{getRewards(airdrop)[0]}</Text>
                <Text type="p" secondary classes="text-lg inline">{getRewards(airdrop)[1]}</Text>
            </div>
        </div>
    {/each}
</div>
<div class="flex flex-row space-x-1">
    <Button classes="w-full" onClick={handleConfirmClick}>{localize('actions.confirm')}</Button>
</div>
