<script>
    import { Button, Illustration, Text } from 'shared/components';
    import { closePopup } from 'shared/lib/popup';

    export let locale

    let stepIndex = 0

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
        width: 500px;

        :global(img) {
            min-height: 280px;
            max-width: 100%;
            object-position: 0 -3px;
        }
    }
</style>

<Text type="h4" classes="mb-6">{locale('popups.ledgerAppGuide.title')}</Text>
<div class="w-full flex flex-row flex-wrap">
    <div class="illustration w-full bg-white dark:bg-gray-900 flex justify-center">
        <Illustration illustration={locale('popups.ledgerAppGuide.steps')[stepIndex].illustration} />
    </div>
    <div class="w-full text-center my-9 px-10">
        <Text secondary>{locale('popups.ledgerAppGuide.steps')[stepIndex].text}</Text>
    </div>
    <div class="w-full flex flex-row flex-nowrap justify-between space-x-3">
        <Button
            classes="w-1/3"
            secondary
            onClick={() => changeIndex(-1)}
            disabled={stepIndex === 0}
        >{locale('actions.previous')}</Button>
        {#if stepIndex < locale('popups.ledgerAppGuide.steps').length - 1}
            <Button
                classes="w-1/3"
                secondary
                onClick={() => changeIndex(1)}
            >{locale('actions.next')}</Button>
        {:else}
            <Button
                classes="w-1/3"
                primary
                onClick={handleCloseClick}
            >{locale('actions.close')}</Button>
        {/if}
    </div>
</div>
