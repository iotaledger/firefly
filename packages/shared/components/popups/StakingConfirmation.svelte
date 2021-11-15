<script lang="typescript">
    import { Button, Illustration, Text } from 'shared/components'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { calculateStakingAirdrop, STAKING_AIRDROP_TOKENS } from 'shared/lib/staking'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { StakingAirdrop } from 'shared/lib/typings/staking'
    import { Locale } from 'shared/lib/typings/i18n'
    import { WalletAccount } from 'shared/lib/typings/wallet'

    export let locale: Locale
    export let accountsToStake: WalletAccount[] = []

    const stakingAmount =
        accountsToStake.map((a) => a.rawIotaBalance).reduce((tot, cur) => tot + cur, 0)

    const handleStakeClick = () => {
        openPopup({
            type: 'stakingCompletion',
        })
    }
</script>

<Illustration illustration="staking-confirmation" classes="mt-2 mb-6" />
<div class="flex flex-row mb-6 space-x-2">
    {#each Object.keys(StakingAirdrop) as airdrop}
        <div class="p-2 text-center">
            <div class="mb-2 flex flex-row justify-center">
                <Text type="p" classes="font-extrabold text-lg">
                    {airdrop}
                </Text>
                <Text type="p" classes="ml-1 text-lg">
                    ({STAKING_AIRDROP_TOKENS[airdrop]})
                </Text>
            </div>
            <Text type="p" secondary classes="mb-2">
                Stake for 90 days and receive an estimated airdrop of:
            </Text>
            <Text type="p" classes="text-2xl">
                {formatUnitBestMatch(calculateStakingAirdrop(stakingAmount, airdrop))}
            </Text>
        </div>
    {/each}
</div>
<div class="flex flex-row space-x-2">
    <Button secondary classes="w-1/2" onClick={closePopup}>
        {locale('actions.cancel')}
    </Button>
    <Button classes="w-1/2" onClick={handleStakeClick}>
        Stake
    </Button>
</div>
