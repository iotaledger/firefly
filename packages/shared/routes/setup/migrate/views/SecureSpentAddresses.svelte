<script lang="typescript">
    import { Button, Illustration, OnboardingLayout, SpentAddress, Text } from 'shared/components'
    import { createEventDispatcher } from 'svelte'
    import { toggleInputSelection, spentAddressesFromBundles, MINIMUM_MIGRATION_BALANCE } from 'shared/lib/migration'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    // TODO: dummy
    let addresses = $spentAddressesFromBundles.map((address) =>
        Object.assign({}, address, { disabled: address.balance < MINIMUM_MIGRATION_BALANCE, id: address.index })
    )

    let selectedAddresses = addresses.slice().filter((address) => !address.disabled)

    function onAddressClick(address) {
        var index = selectedAddresses.findIndex((_address) => _address.id === address.id)
        if (index === -1) {
            selectedAddresses.push(address)
        } else {
            selectedAddresses.splice(index, 1)
        }

        toggleInputSelection(address)
        selectedAddresses = selectedAddresses
    }

    function handleBackClick() {
        dispatch('previous')
    }
    function secureAddresses() {
        dispatch('next')
    }
    function handleSkipClick() {
        console.log('Skip clicked')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5 mt-5">{locale('views.secureSpentAddresses.title')}</Text>
            <Text type="p" secondary>{locale('views.secureSpentAddresses.body1', { values: { number: addresses.length } })}</Text>
            <Text type="p" secondary classes="mb-6">{locale('views.secureSpentAddresses.body2')}</Text>
            <div class="h-80 overflow-y-auto space-y-2 w-full">
                {#each addresses as address}
                    <SpentAddress
                        {...address}
                        {locale}
                        selected={selectedAddresses.find((_address) => _address.id === address.id)}
                        onClick={() => onAddressClick(address)} />
                {/each}
            </div>
        </div>
        <div slot="leftpane__action" class="flex flex-col items-center">
            <Button classes="w-full mt-2" disabled={!selectedAddresses.length} onClick={() => secureAddresses()}>
                {locale('views.secureSpentAddresses.title')}
            </Button>
            <div on:click={handleSkipClick}>
                <Text type="p" secondary highlighted classes="mt-7 font-bold cursor-pointer">{locale('actions.skip')}</Text>
            </div>
        </div>
        <div slot="rightpane" class="h-full flex">
            <Illustration illustration="migrate-desktop" height="100%" width="auto" classes="h-full object-cover object-left" />
        </div>
    </OnboardingLayout>
{/if}
