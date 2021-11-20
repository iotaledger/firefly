<script lang="typescript">
    import { Button, Illustration, Text } from 'shared/components'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    const handleContinueClick = () => {
        openPopup({
            type: 'stakingManager',
            hideClose: true,
            preventClose: true,
        })
    }
</script>

<Illustration illustration="staking-notice" classes="mt-2 mb-6" />
<Text type="h4" classes="mb-4">
    Staking commences December 15th
</Text>
<Text type="p" secondary classes="mb-6">
    By locking your funds for staking before the event starts,
    you will automatically commence active staking when the staking
    event starts (no additional rewards will be earned).
</Text>
<div class="flex flex-row space-x-2">
    <Button secondary classes="w-1/2" onClick={closePopup}>
        {locale('actions.cancel')}
    </Button>
    <Button classes="w-1/2" onClick={handleContinueClick}>
        Ok, I understand
    </Button>
</div>
