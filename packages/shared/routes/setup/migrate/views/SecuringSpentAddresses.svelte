<script lang="typescript">
    import { BundleMiningLayout, Button, Icon, ProgressBar, Text } from 'shared/components'
    import { createEventDispatcher, onDestroy, onMount } from 'svelte'
    import { getInputIndexesForBundle, createMigrationBundle, selectedBundlesWithSpentAddresses } from 'shared/lib/migration'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    let progressBarPercent = 0
    let progressBarMessage = ''
    let timeout
    let interval

    onMount(() => {
        $selectedBundlesWithSpentAddresses.reduce(
            (promise, bundle) =>
                promise.then((acc) =>
                    createMigrationBundle(getInputIndexesForBundle(bundle), true).then((result) => {
                    }).catch((error) => console.error(error))
                ),
            Promise.resolve([])
        )

        //TODO: retrieve progress and call setProgressBar() to fill it up
        interval = setInterval(() => {
            progressBarPercent = Math.floor(Math.random() * 101)
            progressBarMessage = progressBarPercent.toString() + '% completed'
        }, 2500)
        timeout = setTimeout(() => {
            dispatch('next')
        }, 7500)
    })

    function handleBackClick() {
        dispatch('previous')
    }

    //TODO:
    const learnClick = () => {
        console.log('Learn more clicked')
    }
    //TODO:
    const handleCancelClick = () => {
        console.log('Cancel clicked')
        dispatch('previous')
    }

    onDestroy(() => {
        clearTimeout(timeout)
        clearInterval(interval)
    })
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <BundleMiningLayout onBackClick={handleBackClick}>
        <div slot="icon_boxed">
            <div class="flex justify-center items-center rounded-2xl w-12 h-12 bg-blue-500 shadow-lg">
                <Icon boxed="true" icon="history" classes="text-white" />
            </div>
        </div>
        <div slot="box_content">
            <Text type="h2" classes="mb-5 text-center">{locale('views.securingSpentAddresses.title')}</Text>
            <Text type="p" secondary classes="text-center">{locale('views.bundleMiningWarning.body1')}</Text>
            <Text type="p" secondary classes="mb-4 text-center">{locale('views.bundleMiningWarning.body2')}</Text>
            <Text type="p" secondary classes="mb-8 text-center">{locale('views.bundleMiningWarning.body3')}</Text>
            <div class="flex flex-col flex-grow items-center">
                <Button secondary classes="w-56" onClick={() => learnClick()}>{locale('views.bundleMiningWarning.learn')}</Button>
            </div>
        </div>
        <div slot="actions" class="w-2/5 mt-8">
            <ProgressBar percent={progressBarPercent} message={progressBarMessage} />
            <div on:click={handleCancelClick}>
                <Text type="p" secondary highlighted classes="py-3.5 mt-4 font-bold cursor-pointer text-center">
                    {locale('actions.cancel')}
                </Text>
            </div>
        </div>
    </BundleMiningLayout>
{/if}
