<script lang="typescript">
    import { onboardingProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import {
        LedgerAppName,
        LedgerConnectionState,
        ledgerConnectionState,
        stopPollingLedgerNanoStatus,
    } from '@core/ledger'
    import { formatProtocolName } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { isFunction } from '@core/utils'
    import { Button, LedgerAnimation, Text, TextHint } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { onDestroy, onMount } from 'svelte'

    export let onClose: () => void
    export let onPoll: () => void

    const networkProtocol = $activeProfile?.networkProtocol ?? $onboardingProfile?.networkProtocol

    $: isUndetected = $ledgerConnectionState === LedgerConnectionState.NotConnected
    $: isLocked = $ledgerConnectionState === LedgerConnectionState.Locked
    $: isAppOpen = $ledgerConnectionState === LedgerConnectionState.CorrectAppOpen

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
        stopPollingLedgerNanoStatus()
        if (isFunction(onPoll)) {
            onPoll()
        }
    })

    onDestroy(() => {
        stopPollingLedgerNanoStatus()
    })
</script>

<connect-ledger-popup class="p-8 flex flex-col w-full items-center justify-center text-center">
    <Text type="p" classes="mb-6">
        {locale('popups.ledgerNotConnected.connect', {
            values: { protocol: LedgerAppName.Shimmer },
        })}
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
