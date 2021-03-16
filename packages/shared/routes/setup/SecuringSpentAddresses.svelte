<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { BundleMiningLayout, Button, Icon, Text, ProgressBar } from 'shared/components'
    export let locale
    export let mobile

    const dispatch = createEventDispatcher()
    let progressBarPercent = 0
    let progressBarMessage = ''

    //TODO:
    const learnClick = () => {
        console.log("Learn more clicked")
    }
    //TODO:
    const handleCancelClick = () => {
        console.log("Cancel clicked")
        //dispatch('next')
    }
    //TODO: retrieve progress and call setProgressBar() to fill it up
    setInterval(() => { 
        progressBarPercent = Math.floor(Math.random() * 101)  
        progressBarMessage = progressBarPercent.toString()+'% completed'
    }, 2500)

</script>

{#if mobile}
    <div>foo</div>
{:else}
    <BundleMiningLayout>
        <div slot="icon_boxed">
            <div class="flex justify-center items-center rounded-2xl w-12 h-12 bg-blue-500 shadow-lg">
                <Icon boxed="true" icon="history" classes="text-white" />
            </div>
        </div>
        <div slot="box_content">
            <Text type="h2" classes="mb-5 text-center">{locale('views.securing_spent_addresses.title')}</Text>
            <Text type="p" secondary classes="text-center">{locale('views.bundleMiningWarning.body_1')}</Text>
            <Text type="p" secondary classes="mb-4 text-center">{locale('views.bundleMiningWarning.body_2')}</Text>
            <Text type="p" secondary classes="mb-8 text-center">{locale('views.bundleMiningWarning.body_3')}</Text>
            <div class="flex flex-col flex-grow items-center">
                <Button secondary classes="w-56" onClick={() => learnClick()}>{locale('views.bundleMiningWarning.learn')}</Button>
            </div>
        </div>
        <div slot="actions" class="w-2/5 mt-8">
            <ProgressBar percent={progressBarPercent} message={progressBarMessage}></ProgressBar>
            <div on:click={handleCancelClick}>
                <Text type="p" secondary highlighted classes="py-3.5 mt-4 font-bold cursor-pointer text-center">{locale('actions.cancel')}</Text>
            </div>
        </div>
    </BundleMiningLayout>
{/if}
