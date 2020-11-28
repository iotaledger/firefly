<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Illustration, Text, Button } from 'shared/components'

    export let locale
    export let mobile

    let loading = false

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        loading = true
        setTimeout(() => {
            dispatch('next')
        }, 10000)
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout allowBack={false}>
        <div slot="leftpane__content">
            <Text type="h1" classes="mb-5">{locale('views.migrate.title')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.migrate.body_1')}</Text>
            <Text type="p" secondary highlighted classes="mb-8 font-bold">{locale('views.migrate.body_2')}</Text>
            <div class="mt-24 flex justify-between">
                <balance class="flex-col w-5/12 flex justify-center text-center">
                    <Text type="p" secondary classes="mb-3 uppercase">{locale('views.migrate.existing')}</Text>
                    <div class="flex mb-2 justify-center">
                        <Text type="h2" classes="uppercase">239.321</Text>
                        <Text type="h4" secondary classes="ml-1">Gi</Text>
                    </div>
                    <Text type="p" highlighted classes="mb-3 uppercase">45000 USD</Text>
                </balance>
                <balance class="flex-col w-5/12 flex justify-center text-center">
                    <Text type="p" secondary classes="mb-3 uppercase">{locale('views.migrate.new')}</Text>
                    <div class="justify-center flex mb-2">
                        <Text type="h2" classes="uppercase">239.321</Text>
                        <Text type="h4" secondary classes="ml-1">Gi</Text>
                    </div>
                    <Text type="p" highlighted classes="mb-3 uppercase">45000 USD</Text>
                </balance>
            </div>
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-end items-center">
            <Button disabled={loading} onClick={() => handleContinueClick()}>{locale('actions.begin_transfer')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex p-16">
            <Illustration width="100%" illustration="migrate-desktop" />
        </div>
    </OnboardingLayout>
{/if}
