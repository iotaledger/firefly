<script lang="typescript">
    import { localize } from '@core/i18n'
    import { openPopup } from '@lib/popup'
    import { OnboardingButton } from 'shared/components'

    function handleMintNativeToken() {
        openPopup({
            type: 'mintNativeTokenForm',
        })
    }
</script>

<OnboardingButton
    primaryText={localize('actions.mintNativeToken')}
    secondaryText={localize('general.mintNativeTokenDescription')}
    onClick={handleMintNativeToken}
/>
