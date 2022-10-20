<script lang="typescript">
    import { localize } from '@core/i18n'
    import { openPopup } from '@lib/popup'
    import { OnboardingButton } from 'shared/components'

    function handleMintNft(): void {
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
