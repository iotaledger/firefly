<script lang="typescript">
    import { exportStronghold } from '@contexts/settings'
    import { localize } from '@core/i18n'
    import { showAppNotification } from '@lib/notifications'
    import { openPopup } from '@lib/popup'
    import { Button } from 'shared/components'

    export let isBusy = false
    export let message = ''
    export let showNotification = false

    function handleExportClick() {
        reset()

        const _callback = (cancelled, err) => {
            setTimeout(
                () => {
                    message = ''
                },
                cancelled ? 0 : 5000
            )
            isBusy = false
            if (!cancelled) {
                if (err) {
                    message = localize('general.exportingStrongholdFailed')
                    showNotification &&
                        showAppNotification({
                            type: 'error',
                            message: localize(err),
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

        openPopup({
            type: 'password',
            props: {
                onSuccess: (password) => {
                    isBusy = true
                    message = localize('general.exportingStronghold')
                    exportStronghold(password, _callback)
                },
                returnPassword: true,
                subtitle: localize('popups.password.backup'),
            },
        })
    }

    function reset() {
        isBusy = false
        message = ''
    }
</script>

<Button medium inlineStyle="min-width: 156px;" onClick={handleExportClick} disabled={isBusy} {...$$restProps}>
    {localize('actions.export')}
</Button>
