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

    $: isUndetected = $ledgerDeviceStatus?.connectionState === LedgerConnectionState.NotDetected
    $: isLocked = $ledgerDeviceStatus?.connectionState === LedgerConnectionState.Locked
    $: isAppOpen = $ledgerDeviceStatus?.connectionState === LedgerConnectionState.Connected

    $: animation = getAnimation(isUndetected, isLocked, isAppOpen)

    function getAnimation(isUndetected: boolean, isLocked: boolean, isAppOpen: boolean): string {
        if (isUndetected) {
            return 'ledger-disconnected-desktop'
        } else if (isLocked) {
            return 'ledger-disconnected-desktop'
        } else if (!isAppOpen) {
            return 'ledger-app-closed-desktop'
        } else {
            return 'ledger-connected-desktop'
        }
    }

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
    {#if isUndetected}
        <TextHint danger text={localize('popups.ledgerNotConnected.notDetected')} />
    {:else if isLocked}
        <TextHint warning text={localize('popups.ledgerNotConnected.locked')} />
    {:else if !isAppOpen}
        <TextHint
            info
            text={localize('popups.ledgerNotConnected.appNotOpen', {
                values: { protocol: formatProtocolName(networkProtocol) },
            })}
        />
    {/if}
    <Button secondary classes="w-full" onClick={onCancelClick}>{localize('actions.cancel')}</Button>
</connect-ledger-popup>
