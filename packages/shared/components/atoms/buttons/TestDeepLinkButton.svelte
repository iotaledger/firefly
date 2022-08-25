<script lang="typescript">
    import { localize } from '@core/i18n'
    import { openPopup } from '@lib/popup'
    import { OnboardingButton } from 'shared/components'

    function handleClick() {
        openPopup({
            type: 'testDeepLinkForm',
        })
    }
</script>

<OnboardingButton
    primaryText={localize('actions.testDeepLink')}
    secondaryText={localize('general.testDeepLinkDescription')}
    onClick={handleClick}
/>
