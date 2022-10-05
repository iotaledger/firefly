<script lang="typescript">
    import { localize } from '@core/i18n'
    import { openPopup } from '@lib/popup'
    import { OnboardingButton } from 'shared/components'

    function handleCreateAlias() {
        openPopup({
            type: 'aliasConfirmation',
        })
    }
</script>

<OnboardingButton
    primaryText={localize('actions.createAlias')}
    secondaryText={localize('actions.createAliasDescription')}
    onClick={handleCreateAlias}
/>
