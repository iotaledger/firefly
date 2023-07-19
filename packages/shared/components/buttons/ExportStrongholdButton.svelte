<script lang="ts">
    import { exportStronghold } from '@contexts/settings'
    import { localize } from '@core/i18n'
    import { showAppNotification } from '@auxiliary/notification'
    import { openPopup, PopupId } from '@auxiliary/popup'
    import { Button, ButtonSize } from 'shared/components'

    export let isBusy: boolean = false
    export let message: string = ''
    export let showNotification: boolean = false
    export let overrideTitle: string = ''

    function handleExportStrongholdResponse(cancelled: boolean, error: string | undefined): void {
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
                showNotification &&
                    showAppNotification({
                        type: 'error',
                        message: localize(error),
                    })
            } else {
                message = localize('general.exportingStrongholdSuccess')
                showNotification &&
                    showAppNotification({
                        type: 'info',
                        message: localize('general.exportingStrongholdSuccess'),
                    })
            }
        }
    }

    function onExportClick(): void {
        isBusy = false
        message = ''

        openPopup({
            id: PopupId.UnlockStronghold,
            props: {
                onSuccess: (password: string) => {
                    isBusy = true
                    message = localize('general.exportingStronghold')
                    exportStronghold(password, handleExportStrongholdResponse)
                },
                returnPassword: true,
                subtitle: localize('popups.password.backup'),
            },
        })
    }
</script>

<Button
    size={ButtonSize.Medium}
    inlineStyle="min-width: 156px;"
    onClick={onExportClick}
    disabled={isBusy}
    {...$$restProps}
>
    {overrideTitle || localize('actions.export')}
</Button>
