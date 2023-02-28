<script lang="ts">
    import { localize } from '@core/i18n'
    import { openPopup, PopupId } from '@auxiliary/popup'
    import { OnboardingButton } from 'shared/components'

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
