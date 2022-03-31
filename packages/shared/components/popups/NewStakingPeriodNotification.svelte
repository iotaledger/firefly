<script lang="typescript">
    import { localize } from '@core/i18n'

    import { closePopup } from '@lib/popup'
    import { Button, Icon, Illustration, Text } from 'shared/components'

    function handleOk(): void {
        closePopup(true)
    }
</script>

<Illustration illustration="staking-notification" classes="relative w-full rounded-2xl mb-6 mt-3" />
<Text type="h3" classes="mb-4">{localize('popups.newStakingPeriodNotification.title')}</Text>
<Text type="p" secondary classes="mb-6">{localize('popups.newStakingPeriodNotification.body')}</Text>
<div class="flex items-center justify-between bg-blue-50 dark:bg-gray-800 p-3 rounded-2xl mb-6">
    <div class="flex flex-row items-center space-x-3">
        <Icon icon="info" boxed classes="text-blue-500" />
        <Text type="p" secondary>{localize('popups.newStakingPeriodNotification.info')}</Text>
    </div>
</div>
<div class="flex flex-row space-x-2">
    <Button classes="w-full" onClick={handleOk}>
        {localize('actions.okIUnderstand')}
    </Button>
</div>
