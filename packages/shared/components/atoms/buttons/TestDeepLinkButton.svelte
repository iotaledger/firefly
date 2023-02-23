<script lang="ts">
    import { localize } from '@core/i18n'
    import { openPopup, PopupId } from '@auxiliary/popup'
    import { OnboardingButton } from 'shared/components'

    function handleClick(): void {
        openPopup({
            id: PopupId.TestDeepLinkForm,
        })
    }
</script>

<OnboardingButton
    primaryText={localize('actions.testDeepLink')}
    secondaryText={localize('general.testDeepLinkDescription')}
    onClick={handleClick}
/>
