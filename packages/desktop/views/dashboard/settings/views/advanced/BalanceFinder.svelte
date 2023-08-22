<script lang="ts">
    import { Button, Text, ButtonSize } from 'shared/components'
    import { localize } from '@core/i18n'
    import { openPopup, PopupId } from '@auxiliary/popup'

    function onBalanceFinderClick(): void {
        openPopup({ id: PopupId.BalanceFinder })
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.balanceFinder.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.balanceFinder.description')}</Text>
<div class="flex flex-row items-center">
    <Button size={ButtonSize.Medium} inlineStyle="min-width: 156px;" onClick={onBalanceFinderClick}>
        {localize('actions.findBalances')}
    </Button>
</div>
