<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    const handleStakeClick = () => {
        openPopup({
            type: 'stakingConfirmation',
            hideClose: true,
            props: {
                stakedAmount: 1.2345
            }
        })
    }
</script>

<Text type="h5">
    Choose which wallets you want to stake
</Text>
<Text type="p" secondary>
    When you stake a wallet, your funds are cocked.
    You can unlock these wallets at any time, but
    then you won’t get full staking rewards.
</Text>
<div class="flex flex-row space-x-2">
    <Button secondary classes="w-1/2" onClick={closePopup}>
        {locale('actions.cancel')}
    </Button>
    <Button classes="w-1/2" onClick={handleStakeClick}>
        Stake
    </Button>
</div>
