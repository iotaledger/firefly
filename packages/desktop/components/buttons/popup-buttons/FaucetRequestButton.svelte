<script lang="ts">
    import { OnboardingButton } from 'shared/components'

    import { localize } from '@core/i18n'
    import { FAUCET_URLS, nodeInfo } from '@core/network'
    import { activeProfile } from '@core/profile'

    import { openPopup, PopupId } from '@auxiliary/popup'

    function onGetTokens(): void {
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
        onClick={onGetTokens}
    />
{/if}
