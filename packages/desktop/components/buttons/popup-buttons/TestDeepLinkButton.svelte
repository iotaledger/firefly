<script lang="ts">
    import { OnboardingButton } from '@ui'

    import { localize } from '@core/i18n'

    import { openPopup, PopupId } from '@auxiliary/popup'

    function onClick(): void {
        openPopup({
            id: PopupId.TestDeepLinkForm,
        })
    }
</script>

<OnboardingButton
    primaryText={localize('actions.testDeepLink')}
    secondaryText={localize('general.testDeepLinkDescription')}
    {onClick}
/>
