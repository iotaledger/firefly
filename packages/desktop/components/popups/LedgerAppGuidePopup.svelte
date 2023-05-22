<script lang="ts">
    import { LedgerAnimation, Button, Text } from 'shared/components'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { LedgerAppName } from '@core/ledger'
    import { localize } from '@core/i18n'

    let stepIndex = 0
    const stepAnimations = [
        'ledger-live-updated-desktop',
        'ledger-connected-2-desktop',
        'ledger-search-apps-desktop',
        'ledger-install-apps-desktop',
        'ledger-close-live-desktop',
    ]

    function changeIndex(increment: number): void {
        stepIndex += increment
    }

    function onCloseClick(): void {
        closePopup()
    }
</script>

<Text type="h4" classes="mb-6"
    >{localize('popups.ledgerAppGuide.title', { values: { legacy: LedgerAppName.Shimmer } })}</Text
>
<div class="w-full flex flex-row flex-wrap">
    <LedgerAnimation illustration={stepAnimations[stepIndex]} classes="illustration-wrapper" bgClasses="top-6" />
    <div class="w-full text-center my-9 px-10">
        <Text secondary>
            {localize(`popups.ledgerAppGuide.steps.${stepIndex}`, { values: { legacy: LedgerAppName.Shimmer } })}
        </Text>
    </div>
    <div class="w-full flex flex-row flex-nowrap space-x-4">
        <Button classes="w-1/2" outline onClick={() => changeIndex(-1)} disabled={stepIndex === 0}>
            {localize('actions.previous')}
        </Button>
        {#if stepIndex < Object.keys(localize('popups.ledgerAppGuide.steps')).length - 1}
            <Button classes="w-1/2" outline onClick={() => changeIndex(1)}>{localize('actions.next')}</Button>
        {:else}
            <Button classes="w-1/2" onClick={onCloseClick}>{localize('actions.close')}</Button>
        {/if}
    </div>
</div>
