<script lang="ts">
    import { Checkbox, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfile } from '@core/profile'
    import { setNextSelectedWallet } from '@core/wallet/actions'

    let showHiddenWallets = $activeProfile?.showHiddenWallets
    $: updateActiveProfile({ showHiddenWallets })

    $: if ($activeProfile?.hasLoadedWallets && !showHiddenWallets) {
        setNextSelectedWallet()
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.hiddenWallets.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.hiddenWallets.description')}</Text>
<Checkbox label={localize('actions.showHiddenWallets')} bind:checked={showHiddenWallets} />
