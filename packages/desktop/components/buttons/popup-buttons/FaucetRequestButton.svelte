<script lang="ts">
    import { OnboardingButton } from '@ui'

    import { localize } from '@core/i18n'
    import { FAUCET_URLS, nodeInfo, nodeInfoNetworkName } from '@core/network'
    import { activeProfile } from '@core/profile'

    import { openPopup, PopupId } from '@auxiliary/popup'

    function onGetTokensClick(): void {
        openPopup({
            id: PopupId.FaucetRequest,
        })
    }
</script>

{#if FAUCET_URLS?.[$activeProfile?.network?.id] && $nodeInfo}
    <OnboardingButton
        primaryText={localize('actions.faucetRequest', {
            values: { token: $nodeInfo.baseToken.name },
        })}
        secondaryText={localize('general.faucetRequestDescription', {
            values: { network: $nodeInfoNetworkName },
        })}
        onClick={onGetTokensClick}
    />
{/if}
