<script lang="typescript">
    import { Button, Illustration, Text } from 'shared/components'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import {
        estimateStakingAirdropReward,
        getUnstakedFunds,
        isAccountPartiallyStaked,
        STAKING_AIRDROP_TOKENS
    } from 'shared/lib/participation'
    import { openPopup } from 'shared/lib/popup'
    import { isSoftwareProfile } from 'shared/lib/profile'
    import { Locale } from 'shared/lib/typings/i18n'
    import { ParticipationAction, StakingAirdrop } from 'shared/lib/typings/participation'
    import { checkStronghold } from 'shared/lib/stronghold'
    import { WalletAccount } from 'shared/lib/typings/wallet'

    export let locale: Locale
    export let accountToStake: WalletAccount

    const isPartialStake = isAccountPartiallyStaked(accountToStake?.id)

    const handleBackClick = (): void => {
        openPopup({
            type: 'stakingManager',
        }, true)
    }

    const handleConfirmClick = (): void => {
        const _onConfirm = (): void => {
            openPopup({
                type: 'stakingManager',
                props: {
                    accountToAction: accountToStake,
                    participationAction: ParticipationAction.Stake,
                },
            }, true)
        }

        if ($isSoftwareProfile) {
            checkStronghold(_onConfirm)
        } else {
            console.log('TODO: Handle staking flow for Ledger')
        }
    }
</script>

<div class="mb-2 w-full flex flex-row justify-between items-center">
    <div on:click={handleBackClick} class="cursor-pointer">
        <Text type="p" classes="text-xl font-extrabold">
            ←
        </Text>
    </div>
    <Text type="h3" classes="font-extrabold">
        {accountToStake.alias}
    </Text>
    <Text> </Text>
</div>
<div class="flex flex-col">
    <div class="absolute flex flex-col self-center text-center transform translate-y-28">
        <Text type="p" highlighted classes="text-lg">
            {locale('views.staking.confirmation.title')}
        </Text>
        <Text type="p" classes="text-2xl font-extrabold">
            {isPartialStake
                ? formatUnitBestMatch(getUnstakedFunds(accountToStake))
                : accountToStake.balance
            }
        </Text>
    </div>
    <Illustration illustration="staking-confirmation" classes="mt-2 mb-6" />
</div>
<div class="flex flex-row mb-6 space-x-2">
    {#each Object.keys(StakingAirdrop) as airdrop}
        <div class="p-4 text-center border border-1 border-solid border-gray-300 rounded-xl">
            <div class="mb-2 flex flex-row justify-center">
                <Text type="p" classes="font-extrabold text-lg">
                    {airdrop}
                </Text>
                <Text type="p" classes="ml-1 text-lg">
                    ({STAKING_AIRDROP_TOKENS[airdrop.toLowerCase()]})
                </Text>
            </div>
            <Text type="p" secondary classes="mb-4">
                {locale('views.staking.confirmation.body')}
            </Text>
            <Text type="p" classes="text-2xl">
                {estimateStakingAirdropReward(airdrop.toLowerCase(), accountToStake?.rawIotaBalance)}
            </Text>
        </div>
    {/each}
</div>
<div class="flex flex-row space-x-1">
    <Button classes="w-full" onClick={handleConfirmClick}>
        {locale('views.staking.confirmation.next')}
    </Button>
</div>
