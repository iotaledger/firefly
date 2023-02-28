<script lang="ts">
    import { localize } from '@core/i18n'
    import { FAUCET_URLS, nodeInfo } from '@core/network'
    import { openPopup, PopupId } from '@auxiliary/popup'
    import { OnboardingButton } from 'shared/components'
    import { activeProfile } from '@core/profile'

    function onGetTokensClick(): void {
        openPopup({
            id: PopupId.FaucetRequest,
        })
    }
</script>

{#if FAUCET_URLS?.[$activeProfile?.networkProtocol]?.[$activeProfile?.networkType]}
    <OnboardingButton
        primaryText={localize('actions.faucetRequest', {
            values: { token: $nodeInfo?.baseToken?.name },
        })}
        secondaryText={localize('general.faucetRequestDescription', {
            values: { network: $nodeInfo?.protocol?.networkName },
        })}
        onClick={onGetTokensClick}
    />
{/if}
