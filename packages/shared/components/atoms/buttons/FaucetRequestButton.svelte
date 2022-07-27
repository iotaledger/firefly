<script lang="typescript">
    import { localize } from '@core/i18n'
    import { nodeInfo } from '@core/network'
    import { openPopup } from '@lib/popup'
    import { OnboardingButton } from 'shared/components'

    function handleGetTokens() {
        openPopup({
            type: 'faucetRequest',
        })
    }
</script>

<OnboardingButton
    primaryText={localize('actions.faucetRequest', {
        values: { token: $nodeInfo?.baseToken?.name },
    })}
    secondaryText={localize('general.faucetRequestDescription', {
        values: { network: $nodeInfo?.protocol?.networkName },
    })}
    onClick={handleGetTokens}
/>
