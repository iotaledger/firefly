<script lang="ts">
    import { Button, Text, TextType } from '@ui'

    import { localize } from '@core/i18n'

    import { showAppNotification } from '@auxiliary/notification'
    import { exportStronghold } from '@contexts/settings'

    import { DrawerId, openDrawer } from '@/auxiliary/drawer'

    let isBusy = false
    let message = ''

    function onExportClick(): void {
        function _handleExport(password: string): void {
            isBusy = true
            message = localize('general.exportingStronghold')
            void exportStronghold(password, _handleExportStrongholdResponse)
        }
        function _handleExportStrongholdResponse(cancelled, error): void {
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
        isBusy = false
        message = ''
        openDrawer({ id: DrawerId.EnterPassword, props: { returnPassword: true, onSuccess: _handleExport } })
    }
</script>

<export-stronghold-view class="flex flex-col justify-between h-full">
    <Text type={TextType.p} secondary classes="mb-1">{localize('views.settings.exportStronghold.description')}</Text>
    <Button disabled={isBusy} {isBusy} busyMessage={message} onClick={onExportClick}>
        {localize('actions.export')}
    </Button>
</export-stronghold-view>
