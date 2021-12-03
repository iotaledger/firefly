<script lang="typescript">
    import { Button, Illustration, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'
    import { closePopup, openPopup } from 'shared/lib/popup'

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
<Text type="h4" classes="mb-4">{locale('views.staking.notice.date')}</Text>
<Text type="p" secondary classes="mb-6">{locale('views.staking.notice.body')}</Text>
<div class="flex flex-row space-x-2">
    <Button secondary classes="w-1/2" onClick={closePopup}>{locale('actions.cancel')}</Button>
    <Button classes="w-1/2" onClick={handleContinueClick}>{locale('views.staking.notice.ok')}</Button>
</div>
