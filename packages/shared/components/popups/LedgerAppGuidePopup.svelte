<script lang="typescript">
    import { LedgerAnimation, Button, Text } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { LedgerAppName } from '@core/ledger'
    import { Locale, localize } from '@core/i18n'

    export let locale: Locale

    let stepIndex = 0
    const stepAnimations = [
        'ledger-live-updated-desktop',
        'ledger-connected-2-desktop',
        'ledger-search-apps-desktop',
        'ledger-install-apps-desktop',
        'ledger-close-live-desktop',
    ]

    function changeIndex(increment) {
        stepIndex += increment
    }

    function handleCloseClick() {
        closePopup()
    }
</script>

<Text type="h4" classes="mb-6"
    >{localize('views.ledgerAppGuide.title', { values: { legacy: LedgerAppName.Shimmer } })}</Text
>
<div class="w-full flex flex-row flex-wrap">
    <LedgerAnimation illustration={stepAnimations[stepIndex]} classes="illustration-wrapper" bgClasses="top-6" />
    <div class="w-full text-center my-9 px-10">
        <Text secondary>
            {locale(`popups.ledgerAppGuide.steps.${stepIndex}`, { values: { legacy: LedgerAppName.Shimmer } })}
        </Text>
    </div>
    <div class="w-full flex flex-row flex-nowrap space-x-4">
        <Button classes="w-1/2" outline onClick={() => changeIndex(-1)} disabled={stepIndex === 0}>
            {locale('actions.previous')}
        </Button>
        {#if stepIndex < Object.keys(locale('popups.ledgerAppGuide.steps')).length - 1}
            <Button classes="w-1/2" outline onClick={() => changeIndex(1)}>{locale('actions.next')}</Button>
        {:else}
            <Button classes="w-1/2" onClick={handleCloseClick}>{locale('actions.close')}</Button>
        {/if}
    </div>
</div>
