<script lang="ts">
    import { OnboardingButton } from '@ui'

    import { localize } from '@core/i18n'

    import { openPopup, PopupId } from '@auxiliary/popup'

    function onCreateAccountClick(): void {
        openPopup({
            id: PopupId.AccountConfirmation,
        })
    }
</script>

<OnboardingButton
    primaryText={localize('actions.createAccount')}
    secondaryText={localize('actions.createAccountDescription')}
    onClick={onCreateAccountClick}
/>
