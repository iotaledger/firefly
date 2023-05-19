<script lang="ts">
    import { OnboardingButton } from '@ui'
    import { localize } from '@core/i18n'
    import { openPopup, PopupId } from 'shared/lib/auxiliary/popup'

    function onImportErc20TokenClick(): void {
        openPopup({
            id: PopupId.ImportErc20Token,
        })
    }
</script>

<OnboardingButton
    primaryText={localize('general.importErc20Token')}
    secondaryText={localize('general.importErc20TokenDescription')}
    onClick={onImportErc20TokenClick}
/>
