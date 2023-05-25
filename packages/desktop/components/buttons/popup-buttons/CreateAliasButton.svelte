<script lang="ts">
    import { OnboardingButton } from '@ui'

    import { localize } from '@core/i18n'

    import { openOverlay, PopupId } from '@auxiliary/popup'

    function onCreateAliasClick(): void {
        openOverlay({
            id: PopupId.AliasConfirmation,
        })
    }
</script>

<OnboardingButton
    primaryText={localize('actions.createAlias')}
    secondaryText={localize('actions.createAliasDescription')}
    onClick={onCreateAliasClick}
/>
