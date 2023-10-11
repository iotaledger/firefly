<script lang="ts">
    import { Button, Text, ButtonSize, Checkbox, TextType } from 'shared/components'
    import { localize } from '@core/i18n'
    import { openPopup, PopupId } from '@auxiliary/popup'

    let searchInCurrentWallet: boolean = false

    function onBalanceFinderClick(): void {
        openPopup({
            id: PopupId.BalanceFinder,
            props: {
                title: localize('popups.balanceFinder.title'),
                body: localize('popups.balanceFinder.body'),
                searchInCurrentWallet,
            },
        })
    }
</script>

<Text type={TextType.h4} classes="mb-3">{localize('views.settings.balanceFinder.title')}</Text>
<Text type={TextType.p} secondary classes="mb-5">{localize('views.settings.balanceFinder.description')}</Text>
<div class="flex flex-col space-y-4">
    <div class="flex flex-row items-center">
        <Button size={ButtonSize.Medium} inlineStyle="min-width: 156px;" onClick={onBalanceFinderClick}>
            {localize('actions.findBalances')}
        </Button>
    </div>
    <Checkbox
        label={localize('views.settings.balanceFinder.currentWallet')}
        checked={searchInCurrentWallet}
        onClick={() => (searchInCurrentWallet = !searchInCurrentWallet)}
    />
</div>
