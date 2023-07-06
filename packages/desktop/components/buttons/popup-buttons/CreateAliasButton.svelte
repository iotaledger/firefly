<script lang="ts">
    import { OnboardingButton } from '@ui'

    import { localize } from '@core/i18n'

    import { openPopup, PopupId } from '@auxiliary/popup'

    function onCreateAliasClick(): void {
        openPopup({
            id: PopupId.AliasConfirmation,
        })
    }
</script>

<OnboardingButton
    primaryText={localize('actions.createAlias')}
    secondaryText={localize('actions.createAliasDescription')}
    onClick={onCreateAliasClick}
/>
