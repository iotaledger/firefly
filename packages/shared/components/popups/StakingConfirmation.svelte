<script lang="typescript">
    import { Button, Illustration, Text } from 'shared/components'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { estimateStakingAirdropReward, STAKING_AIRDROP_TOKENS } from 'shared/lib/participation'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import {
        ParticipationAction,
        StakingAction,
        StakingAirdrop,
        StakingSelection
    } from 'shared/lib/typings/participation'
    import { Locale } from 'shared/lib/typings/i18n'
    import { WalletAccount } from '../../lib/typings/wallet'
    import { onMount } from 'svelte'
    import { isSoftwareProfile } from '../../lib/profile'
    import { api } from '../../lib/wallet'
    import { checkStronghold } from '../../lib/stronghold'
    import { promptUserToConnectLedger } from '../../lib/ledger'

    export let locale: Locale
    export let accountToStake: WalletAccount

    const handleBackClick = (): void => {
        openPopup({
            type: 'stakingManager',
            hideClose: true,
            preventClose: true,
        }, true)
    }

    const handleConfirmClick = (): void => {
        const _onConfirm = (): void => {
            openPopup({
                type: 'stakingManager',
                hideClose: true,
                preventClose: true,
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

    onMount(() => {
        // TODO: Properly handle this later with a notification
        // AND closing the popup. The user should likely never see
        // this error message.
        if (!accountToStake) {
            console.error('ERROR: No account to stake')
        }
    })
</script>

<div class="mb-2 w-full flex flex-row justify-between items-center">
    <div on:click={handleBackClick} class="cursor-pointer">
        <Text type="p" classes="text-xl font-extrabold">
            ←
        </Text>
    </div>
    <Text type="p" classes="font-extrabold">
        {accountToStake.alias}
    </Text>
    <Text> </Text>
</div>
<div class="flex flex-col">
    <div class="absolute flex flex-col self-center text-center transform translate-y-28">
        <Text type="p" highlighted classes="text-lg">
            You're about to stake
        </Text>
        <Text type="p" classes="text-2xl font-extrabold">
            {accountToStake.balance}
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
                Stake for 90 days and receive an estimated airdrop of:
            </Text>
            <Text type="p" classes="text-2xl">
                TODO
            </Text>
        </div>
    {/each}
</div>
<div class="flex flex-row space-x-1">
    <Button classes="w-full" onClick={handleConfirmClick}>
        Confirm
    </Button>
</div>
