<script lang="ts">
    import { localize } from '@core/i18n'
    import { openPopup, PopupId } from '@auxiliary/popup'
    import { OnboardingButton } from 'shared/components'
    import { resetMintNftDetails } from '@core/wallet'

    function onMintNftClick(): void {
        resetMintNftDetails()
        openPopup({
            id: PopupId.MintNftForm,
        })
    }
</script>

<OnboardingButton
    primaryText={localize('actions.mintNft')}
    secondaryText={localize('general.mintNftDescription')}
    onClick={onMintNftClick}
/>
