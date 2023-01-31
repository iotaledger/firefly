<script lang="ts">
    import { setNextSelectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfile } from '@core/profile'
    import { Checkbox, Text, TextType } from 'shared/components'

    let showHiddenAccounts = $activeProfile?.showHiddenAccounts
    $: updateActiveProfile({ showHiddenAccounts: showHiddenAccounts })

    $: if ($activeProfile?.hasLoadedAccounts && !showHiddenAccounts) {
        setNextSelectedAccount()
    }
</script>

<div class="flex flex-col space-y-4">
    <Text type={TextType.p} secondary>{localize('views.settings.hiddenAccounts.description')}</Text>
    <Checkbox label={localize('actions.showHiddenAccounts')} bind:checked={showHiddenAccounts} />
</div>
