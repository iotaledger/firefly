<script lang="typescript">
    import { Button, Text, ButtonSize } from 'shared/components'
    import { localize } from '@core/i18n'
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.migrateLedgerIndex.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.migrateLedgerIndex.description')}</Text>
<Button size={ButtonSize.Medium} inlineStyle="min-width: 156px;">
    {localize('views.settings.migrateLedgerIndex.title')}
</Button>
