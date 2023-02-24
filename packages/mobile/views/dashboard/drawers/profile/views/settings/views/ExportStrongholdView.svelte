<script lang="ts">
    import { showAppNotification } from '@auxiliary/notification'
    import { exportStronghold } from '@contexts/settings'
    import { localize } from '@core/i18n'
    import { Button, Text, TextType } from '@ui'
    import { settingsRouter } from '@/routers'

    let isBusy = false
    let message = ''

    function handleExportClick(): void {
        isBusy = false
        message = ''

        const handleExport = (password: string) => {
            isBusy = true
            message = localize('general.exportingStronghold')
            exportStronghold(password, handleExportStrongholdResponse)
        }

        $settingsRouter.setNeedsUnlock(true, handleExport, true)
    }

    function handleExportStrongholdResponse(cancelled, error): void {
        setTimeout(
            () => {
                message = ''
            },
            cancelled ? 0 : 5000
        )
        isBusy = false
        if (!cancelled) {
            if (error) {
                message = localize('general.exportingStrongholdFailed')
                showAppNotification({
                    type: 'error',
                    message: localize(error),
                })
            } else {
                message = localize('general.exportingStrongholdSuccess')
                showAppNotification({
                    type: 'info',
                    message: localize('general.exportingStrongholdSuccess'),
                })
            }
        }
    }
</script>

<div class="flex flex-col justify-between h-full">
    <Text type={TextType.p} secondary classes="mb-1">{localize('views.settings.exportStronghold.description')}</Text>
    <Button disabled={isBusy} {isBusy} busyMessage={message} onClick={handleExportClick}>
        {localize('actions.export')}
    </Button>
</div>
