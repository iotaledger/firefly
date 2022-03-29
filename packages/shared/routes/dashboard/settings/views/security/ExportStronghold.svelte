<script lang="typescript">
    import { Button, Spinner, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'

    export let exportStronghold: (password: string, callback?: (cancelled: boolean, err?: string) => void) => void

    let exportBusy = false
    let exportMessage = ''

    function handleExportClick() {
        reset()

        const _callback = (cancelled, err) => {
            setTimeout(
                () => {
                    exportMessage = ''
                },
                cancelled ? 0 : 2000
            )
            exportBusy = false
            if (!cancelled) {
                if (err) {
                    exportMessage = localize('general.exportingStrongholdFailed')
                    showAppNotification({
                        type: 'error',
                        message: localize(err),
                    })
                } else {
                    exportMessage = localize('general.exportingStrongholdSuccess')
                }
            }
        }

        openPopup({
            type: 'password',
            props: {
                onSuccess: (password) => {
                    exportBusy = true
                    exportMessage = localize('general.exportingStronghold')
                    exportStronghold(password, _callback)
                },
                returnPassword: true,
                subtitle: localize('popups.password.backup'),
            },
        })
    }

    function reset() {
        exportBusy = false
        exportMessage = ''
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.exportStronghold.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.exportStronghold.description')}</Text>
<div class="flex flex-row items-center">
    <Button medium inlineStyle="min-width: 156px;" onClick={handleExportClick} disabled={exportBusy}>
        {localize('actions.export')}
    </Button>
    <Spinner busy={exportBusy} message={exportMessage} classes="ml-2" />
</div>
