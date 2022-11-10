<script lang="typescript">
    import { localize } from '@core/i18n'
    import { openPopup } from '@auxiliary/popup'
    import { OnboardingButton } from 'shared/components'
    import { resetMintNftDetails } from '@core/wallet'

    function handleMintNft(): void {
        resetMintNftDetails()
        openPopup({
            type: 'mintNftForm',
        })
    }
</script>

<OnboardingButton
    primaryText={localize('actions.mintNft')}
    secondaryText={localize('general.mintNftDescription')}
    onClick={handleMintNft}
/>
