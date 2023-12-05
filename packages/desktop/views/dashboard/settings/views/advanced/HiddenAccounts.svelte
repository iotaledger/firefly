<script lang="ts">
    import { Checkbox, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfile } from '@core/profile'
    import { setNextSelectedWallet } from '@core/wallet/actions'

    let showHiddenAccounts = $activeProfile?.showHiddenAccounts
    $: updateActiveProfile({ showHiddenAccounts: showHiddenAccounts })

    $: if ($activeProfile?.hasLoadedAccounts && !showHiddenAccounts) {
        setNextSelectedWallet()
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.hiddenAccounts.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.hiddenAccounts.description')}</Text>
<Checkbox label={localize('actions.showHiddenAccounts')} bind:checked={showHiddenAccounts} />
