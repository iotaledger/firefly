<script lang="typescript">
    import { Animation, Button, Illustration, Text } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { LedgerAppName } from '@core/ledger'
    import { Locale } from '@core/i18n'

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

<Text type="h4" classes="mb-6">{locale('popups.ledgerAppGuide.title')}</Text>
<div class="w-full flex flex-row flex-wrap">
    <div class="illustration-wrapper relative w-full bg-white dark:bg-gray-900 flex justify-center items-center">
        <div class="animation absolute transform top-2 left-1/2 -translate-x-1/2 z-0">
            <Animation animation="ledger-bg-desktop" />
        </div>
        <Illustration illustration={stepAnimations[stepIndex]} />
    </div>
    <div class="w-full text-center my-9 px-10">
        <Text secondary>
            {locale(`popups.ledgerAppGuide.steps.${stepIndex}`, { values: { legacy: LedgerAppName.Shimmer } })}
        </Text>
    </div>
    <div class="w-full flex flex-row flex-nowrap space-x-4">
        <Button classes="w-1/2" secondary onClick={() => changeIndex(-1)} disabled={stepIndex === 0}>
            {locale('actions.previous')}
        </Button>
        {#if stepIndex < Object.keys(locale('popups.ledgerAppGuide.steps')).length - 1}
            <Button classes="w-1/2" secondary onClick={() => changeIndex(1)}>{locale('actions.next')}</Button>
        {:else}
            <Button classes="w-1/2" primary onClick={handleCloseClick}>{locale('actions.close')}</Button>
        {/if}
    </div>
</div>

<style type="text/scss">
    .illustration-wrapper {
        height: 320px;
        .animation {
            width: 117%;
            height: 117%;
        }
        :global(img) {
            min-height: 280px;
            max-width: 100%;
            object-position: 0 -3px;
            z-index: 1;
        }
    }
</style>
