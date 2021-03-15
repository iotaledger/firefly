<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { Button, Illustration, OnboardingLayout, Text, TransactionItem } from 'shared/components'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    function handleMigrateClick() {
        console.log("migrate clicked")
    }
    function handleBackClick() {
        dispatch('previous')
    }

    let selected = false
    function selectItem(){
        console.log("selected")
    }

</script>

<style type="text/scss">
	.selected {
        @apply border-blue-500;
        @apply border-2;
	}
</style>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={() => dispatch('previous')} class="">
        <div slot="leftpane__content">
            <Text type="h1" classes="mb-5 mt-5">{locale('views.migrate.title')}</Text>
            <Text type="p" secondary classes="mb-6">{locale('views.transfer_fragmented_funds.body_1')}</Text>
            <TransactionItem name={"Transaction 1"} amount={"458.52 Mi"} />
            <TransactionItem name={"Transaction 2"} amount={"4.63 i"}/>
            <TransactionItem name={"Transaction 3"} amount={"28.52 Mi"}/>
            <TransactionItem name={"Transaction 3"} amount={"44.63 Gi"}/>
        </div>
        <div slot="leftpane__action" class="flex flex-col items-center space-x-4">
            <Button classes="w-full py-3 mt-2" onClick={() => selectItem()}>{locale('views.transfer_fragmented_funds.migrate')}</Button>
        </div>
        <div slot="rightpane" class="h-full flex">
            <Illustration illustration="migrate-desktop" height="100%" width="auto" classes="h-full object-cover object-left" />
        </div>
    </OnboardingLayout>
{/if}
