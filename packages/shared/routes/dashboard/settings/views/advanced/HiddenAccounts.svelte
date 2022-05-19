<script lang="typescript">
    import { Checkbox, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfileSettings, setNextSelectedAccount } from '@core/profile'

    let showHiddenAccounts = $activeProfile?.settings.showHiddenAccounts
    $: updateActiveProfileSettings({ showHiddenAccounts: showHiddenAccounts })

    $: if (!showHiddenAccounts) {
        setNextSelectedAccount()
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.hiddenAccounts.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.hiddenAccounts.description')}</Text>
<Checkbox label={localize('actions.showHiddenAccounts')} bind:checked={showHiddenAccounts} />
