<script lang="ts">
    import { Button, Text, ButtonSize } from 'shared/components'
    import { localize } from '@core/i18n'
    import { openPopup, PopupId } from '@auxiliary/popup'

    function onWalletFinderClick(): void {
        openPopup({ id: PopupId.WalletFinder })
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.walletFinder.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.walletFinder.description')}</Text>
<div class="flex flex-row items-center">
    <Button size={ButtonSize.Medium} inlineStyle="min-width: 156px;" onClick={onWalletFinderClick}>
        {localize('actions.findWallets')}
    </Button>
</div>
