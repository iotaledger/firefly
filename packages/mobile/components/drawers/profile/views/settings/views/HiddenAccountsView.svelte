<script lang="ts">
    import { Checkbox, Text, TextType } from '@ui'

    import { setNextSelectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfile } from '@core/profile'

    let showHiddenAccounts = $activeProfile?.showHiddenAccounts
    $: updateActiveProfile({ showHiddenAccounts: showHiddenAccounts })

    $: if ($activeProfile?.hasLoadedAccounts && !showHiddenAccounts) {
        setNextSelectedAccount()
    }
</script>

<hidden-accounts-view class="flex flex-col space-y-4">
    <Text type={TextType.p} secondary>{localize('views.settings.hiddenAccounts.description')}</Text>
    <Checkbox label={localize('actions.showHiddenAccounts')} bind:checked={showHiddenAccounts} />
</hidden-accounts-view>
