<script lang="typescript">
    import { onboardingProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { LedgerConnectionState, ledgerConnectionState } from '@core/ledger'
    import { formatProtocolName } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { isFunction } from '@core/utils'
    import { Button, LedgerAnimation, Text, TextHint } from 'shared/components'
    import { FontWeight, TextType } from 'shared/components/Text.svelte'
    import { closePopup } from 'shared/lib/popup'

    export let onClose: () => void

    const networkProtocol = $activeProfile?.networkProtocol ?? $onboardingProfile?.networkProtocol

    $: isNotConnected = $ledgerConnectionState === LedgerConnectionState.NotConnected
    $: isLocked = $ledgerConnectionState === LedgerConnectionState.Locked
    $: isAppNotOpen = $ledgerConnectionState === LedgerConnectionState.AppNotOpen
    $: isCorrectAppOpen = $ledgerConnectionState === LedgerConnectionState.CorrectAppOpen

    let animation: string
    $: $ledgerConnectionState, setAnimation()
    function setAnimation(): void {
        if (isNotConnected) {
            animation = 'ledger-disconnected-desktop'
        } else if (isLocked) {
            animation = 'ledger-disconnected-desktop'
        } else if (isAppNotOpen) {
            animation = 'ledger-app-closed-desktop'
        } else if (isCorrectAppOpen) {
            animation = 'ledger-connected-desktop'
        } else {
            animation = 'ledger-disconnected-desktop'
        }
    }

    function onCancelClick(): void {
        if (isFunction(onClose)) {
            onClose()
        }
        closePopup()
    }
</script>

<connect-ledger-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.ledgerNotConnected.title')}
    </Text>
    <LedgerAnimation {animation} />
    {#if isNotConnected}
        <TextHint danger text={localize('popups.ledgerNotConnected.notConnected')} />
    {:else if isLocked}
        <TextHint warning text={localize('popups.ledgerNotConnected.locked')} />
    {:else if isAppNotOpen}
        <TextHint
            info
            text={localize('popups.ledgerNotConnected.appNotOpen', {
                values: { protocol: formatProtocolName(networkProtocol) },
            })}
        />
    {:else if isCorrectAppOpen}
        <TextHint success text={localize('popups.ledgerNotConnected.correctAppOpen')} />
    {/if}
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" secondary onClick={onCancelClick}>
            {localize('actions.cancel')}
        </Button>
        <Button classes="w-full" disabled={!isCorrectAppOpen}>
            {localize('actions.continue')}
        </Button>
    </popup-buttons>
</connect-ledger-popup>
