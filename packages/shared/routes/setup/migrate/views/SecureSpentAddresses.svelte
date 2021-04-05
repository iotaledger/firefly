<script lang="typescript">
    import { Button, Illustration, OnboardingLayout, SpentAddress, Text } from 'shared/components'
    import { createEventDispatcher } from 'svelte'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    // TODO: dummy
    let addresses = Array.from({ length: 8 }, (_, id) => {
        let balance = Math.floor(Math.random() * 4000000)
        return {
            id,
            address: 'iot1q9f0mlq8yxpx2nck8a0slxnzr4ef2ek8f5gqxlzd0wasgp73utryjtzcp98',
            balance,
            disabled: balance < 1000000,
        }
    }).sort((a, b) => b.balance - a.balance)

    let selectedAddresses = addresses.slice().filter((address) => !address.disabled)

    function onAddressClick(address) {
        var index = selectedAddresses.findIndex((_address) => _address.id === address.id)
        if (index === -1) {
            selectedAddresses.push(address)
        } else {
            selectedAddresses.splice(index, 1)
        }
        selectedAddresses = selectedAddresses
    }

    function handleBackClick() {
        dispatch('previous')
    }
    function secureAddresses() {
        dispatch('next')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content" class="h-full flex flex-col flex-wrap">
            <Text type="h2" classes="mb-5">{locale('views.secureSpentAddresses.title')}</Text>
            <Text type="p" secondary>{locale('views.secureSpentAddresses.body1', { values: { number: addresses.length } })}</Text>
            <Text type="p" secondary classes="mb-6">{locale('views.secureSpentAddresses.body2')}</Text>
            <div class="flex-auto overflow-y-auto h-1 space-y-4 w-full -mr-2 pr-2">
                {#each addresses as address}
                    <SpentAddress
                        {...address}
                        {locale}
                        selected={selectedAddresses.find((_address) => _address.id === address.id)}
                        onClick={() => onAddressClick(address)} />
                {/each}
            </div>
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" disabled={!selectedAddresses.length} onClick={() => secureAddresses()}>
                {locale('views.secureSpentAddresses.title')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
            <Illustration illustration="migrate-desktop" height="100%" width="auto" />
        </div>
    </OnboardingLayout>
{/if}
