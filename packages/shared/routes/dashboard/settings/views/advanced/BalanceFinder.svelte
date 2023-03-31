<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { openPopup } from 'shared/lib/popup'

    function handleBalanceFinderClick() {
        openPopup({ type: 'balanceFinder', hideClose: false })
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.balanceFinder.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.balanceFinder.description')}</Text>
<div class="flex flex-row items-center">
    <Button medium inlineStyle="min-width: 156px;" onClick={handleBalanceFinderClick}>
        {localize('actions.findBalances')}
    </Button>
</div>
