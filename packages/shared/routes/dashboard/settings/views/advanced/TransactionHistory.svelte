<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { openPopup } from 'shared/lib/popup'

    function handleExportTransactionHistoryClick() {
        openPopup({ type: 'exportTransactionHistory', hideClose: false })
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.transactionHistory.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.transactionHistory.description')}</Text>
<Button classes="px-10" medium inlineStyle="min-width: 156px;" onClick={handleExportTransactionHistoryClick}>
    {localize('actions.exportTransactionHistory')}
</Button>
