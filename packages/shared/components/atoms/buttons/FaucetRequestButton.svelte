<script lang="typescript">
    import { localize } from '@core/i18n'
    import { FAUCET_URL, nodeInfo } from '@core/network'
    import { openPopup } from '@lib/popup'
    import { OnboardingButton } from 'shared/components'
    import { activeProfile } from '@core/profile'

    function handleGetTokens() {
        openPopup({
            type: 'faucetRequest',
        })
    }
</script>

{#if FAUCET_URL?.[$activeProfile?.networkProtocol]?.[$activeProfile?.networkType]}
    <OnboardingButton
        primaryText={localize('actions.faucetRequest', {
            values: { token: $nodeInfo?.baseToken?.name },
        })}
        secondaryText={localize('general.faucetRequestDescription', {
            values: { network: $nodeInfo?.protocol?.networkName },
        })}
        onClick={handleGetTokens}
    />
{/if}
