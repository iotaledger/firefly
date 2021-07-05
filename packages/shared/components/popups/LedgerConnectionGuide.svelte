<script>
    import { Button, Illustration, Text } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'

    export let locale

    let stepIndex = 0
    let stepAnimations = ['background-ledger-live-desktop', 'ledger-unlocked-desktop', 'open-ledger-app-desktop']

    function changeIndex(increment) {
        stepIndex += increment
    }

    function handleCloseClick() {
        closePopup()
    }
</script>

<style type="text/scss">
    .illustration {
        height: 320px;

        :global(img) {
            min-height: 280px;
            max-width: 100%;
            object-position: 0 -3px;
        }
    }
</style>

<Text type="h4" classes="mb-6">{locale('popups.ledgerConnectionGuide.title')}</Text>
<div class="w-full flex flex-row flex-wrap">
    <div class="illustration w-full bg-white dark:bg-gray-900 flex justify-center">
        <Illustration illustration={stepAnimations[stepIndex]} />
    </div>
    <div class="w-full text-center my-9 px-10">
        <Text secondary>{locale('popups.ledgerConnectionGuide.steps')[stepIndex]}</Text>
    </div>
    <div class="w-full flex flex-row flex-nowrap space-x-4">
        <Button classes="w-1/2" secondary onClick={() => changeIndex(-1)} disabled={stepIndex === 0}>
            {locale('actions.previous')}
        </Button>
        {#if stepIndex < locale('popups.ledgerConnectionGuide.steps').length - 1}
            <Button classes="w-1/2" secondary onClick={() => changeIndex(1)}>{locale('actions.next')}</Button>
        {:else}
            <Button classes="w-1/2" primary onClick={handleCloseClick}>{locale('actions.close')}</Button>
        {/if}
    </div>
</div>
