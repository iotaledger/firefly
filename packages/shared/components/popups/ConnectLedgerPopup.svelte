<script lang="typescript">
    import { onDestroy, onMount } from 'svelte'
    import { Button, LedgerAnimation, Text, TextHint } from 'shared/components'
    import { FontWeight, TextType } from 'shared/components/Text.svelte'
    import { localize } from '@core/i18n'
    import { LedgerConnectionState, ledgerDeviceStatus, stopPollingLedgerStatus } from '@core/ledger'
    import { isFunction } from '@core/utils'
    import { formatProtocolName } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { onboardingProfile } from '@contexts/onboarding'
    import { closePopup } from '@lib/popup'

    export let onClose: () => void
    export let onPoll: () => void

    const networkProtocol = $activeProfile?.networkProtocol ?? $onboardingProfile?.networkProtocol

    $: isConnected = $ledgerDeviceStatus.connectionState !== LedgerConnectionState.NotDetected
    $: isAppOpen = $ledgerDeviceStatus.connectionState === LedgerConnectionState.Connected
    $: animation = !isConnected
        ? 'ledger-disconnected-desktop'
        : isAppOpen
        ? 'ledger-connected-desktop'
        : 'ledger-app-closed-desktop'

    function onCancelClick(): void {
        if (isFunction(onClose)) {
            onClose()
        }
        closePopup()
    }

    onMount(() => {
        stopPollingLedgerStatus()
        if (isFunction(onPoll)) {
            onPoll()
        }
    })

    onDestroy(() => {
        stopPollingLedgerStatus()
    })
</script>

<connect-ledger-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.ledgerNotConnected.title')}
    </Text>
    <LedgerAnimation {animation} />
    <TextHint
        info
        text={localize('popups.ledgerNotConnected.connect', {
            values: { protocol: formatProtocolName(networkProtocol) },
        })}
    />
    <Button secondary classes="w-full" onClick={onCancelClick}>{localize('actions.cancel')}</Button>
</connect-ledger-popup>
