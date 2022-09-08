<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { openPopup } from 'shared/lib/popup'

    function handleWalletFinderClick() {
        openPopup({ type: 'walletFinder' })
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.walletFinder.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.walletFinder.description')}</Text>
<div class="flex flex-row items-center">
    <Button inlineStyle="min-width: 156px;" onClick={handleWalletFinderClick}>
        {localize('actions.findWallets')}
    </Button>
</div>
