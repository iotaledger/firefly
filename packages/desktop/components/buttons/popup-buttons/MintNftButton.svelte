<script lang="ts">
    import { OnboardingButton } from '@ui'

    import { localize } from '@core/i18n'
    import { resetMintNftDetails } from '@core/wallet'
    import { openOverlay, PopupId } from '@auxiliary/popup'

    function onMintNftClick(): void {
        resetMintNftDetails()
        openOverlay({
            id: PopupId.MintNftForm,
        })
    }
</script>

<OnboardingButton
    primaryText={localize('actions.mintNft')}
    secondaryText={localize('general.mintNftDescription')}
    onClick={onMintNftClick}
/>
