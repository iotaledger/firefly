<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { BundleMiningLayout, Button, Icon, Text } from 'shared/components'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    // TODO:
    const learnClick = () => {
        console.log("Learn more clicked")
    }
    const handleContinueClick = () => {
        console.log("Continue clicked")
        //dispatch('next')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <BundleMiningLayout>
        <div slot="icon_boxed">
            <div class="flex justify-center items-center rounded-2xl w-12 h-12 bg-orange-300 shadow-lg">
                <Icon boxed="true" icon="warning" classes="text-orange-700" />
            </div>
        </div>
        <div slot="box_content">
            <Text type="h1" classes="mb-5 text-center">{locale('views.bundleMiningWarning.title')}</Text>
            <Text type="p" secondary classes="text-center">{locale('views.bundleMiningWarning.body_1')}</Text>
            <Text type="p" secondary classes="mb-4 text-center">{locale('views.bundleMiningWarning.body_2')}</Text>
            <Text type="p" secondary classes="mb-8 text-center">{locale('views.bundleMiningWarning.body_3')}</Text>
            <div class="flex flex-col flex-grow items-center">
                <Button secondary classes="w-56" onClick={() => learnClick()}>{locale('views.bundleMiningWarning.learn')}</Button>
            </div>
        </div>
        <div slot="actions">
            <Button classes="w-64 my-8" onClick={() => handleContinueClick()}>{locale('actions.continue')}</Button>
        </div>
    </BundleMiningLayout>
{/if}
