<script lang="ts">
    import { localize } from '@core/i18n'
    import { openPopup } from '@auxiliary/popup'
    import { OnboardingButton } from 'shared/components'

    function handleCreateAlias(): void {
        openPopup({
            id: 'aliasConfirmation',
        })
    }
</script>

<OnboardingButton
    primaryText={localize('actions.createAlias')}
    secondaryText={localize('actions.createAliasDescription')}
    onClick={handleCreateAlias}
/>
