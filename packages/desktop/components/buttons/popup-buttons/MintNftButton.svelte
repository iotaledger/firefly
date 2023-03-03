<script lang="ts">
    import { OnboardingButton } from 'shared/components'

    import { localize } from '@core/i18n'
    import { resetMintNftDetails } from '@core/wallet'

    import { openPopup, PopupId } from '@auxiliary/popup'

    function onMintNft(): void {
        resetMintNftDetails()
        openPopup({
            id: PopupId.MintNftForm,
        })
    }
</script>

<OnboardingButton
    primaryText={localize('actions.mintNft')}
    secondaryText={localize('general.mintNftDescription')}
    onClick={onMintNft}
/>
