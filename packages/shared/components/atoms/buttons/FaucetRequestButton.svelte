<script lang="typescript">
    import { localize } from '@core/i18n'
    import { FAUCET_URLS, nodeInfo } from '@core/network'
    import { openPopup } from '@lib/popup'
    import { OnboardingButton } from 'shared/components'
    import { activeProfile } from '@core/profile'

    function handleGetTokens(): void {
        openPopup({
            type: 'faucetRequest',
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
        onClick={handleGetTokens}
    />
{/if}
