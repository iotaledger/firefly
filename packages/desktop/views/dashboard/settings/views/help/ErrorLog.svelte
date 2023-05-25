<script lang="ts">
    import { Button, Text, ButtonSize } from 'shared/components'
    import { localize } from '@core/i18n'
    import { openOverlay, PopupId } from '@auxiliary/popup'

    function onErrorLogClick(): void {
        openOverlay({ id: PopupId.ErrorLog })
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.errorLog.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.errorLog.description')}</Text>
<Button size={ButtonSize.Medium} inlineStyle="min-width: 156px;" onClick={onErrorLogClick}>
    {localize('views.settings.errorLog.title')}
</Button>
