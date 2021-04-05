<script lang="typescript">
    import { Button, Illustration, OnboardingLayout, SpentAddress, Text } from 'shared/components'
    import { createEventDispatcher } from 'svelte'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    // TODO: dummy
    let addresses = Array.from({ length: 4 }, (_, id) => {
        let balance = Math.floor(Math.random() * 4000000)
        return {
            id,
            address: 'iot1q9f0mlq8yxpx2nck8a0slxnzr4ef2ek8f5gqxlzd0wasgp73utryjtzcp98',
            balance,
            disabled: false,
            risk: id,
        }
    }).sort((a, b) => b.risk - a.risk)

    let selectedAddresses = addresses.slice()

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
    function handleContinueClick() {
        dispatch('next')
    }
    function rerunProcess() {
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content" class="h-full flex flex-col flex-wrap">
            <Text type="h2" classes="mb-5">{locale('views.securityCheckCompleted.title')}</Text>
            <Text type="p" secondary classes="mb-6">{locale('views.securityCheckCompleted.body1')}</Text>
            <div class="flex-auto overflow-y-auto h-1 space-y-4 w-full -mr-2 pr-2">
                {#each addresses as address}
                    <SpentAddress
                        {...address}
                        {locale}
                        selected={selectedAddresses.find((_address) => _address.id === address.id)}
                        showRiskLevel
                        onClick={() => onAddressClick(address)} />
                {/each}
            </div>
        </div>
        <div slot="leftpane__action" class="flex flex-col items-center">
            <Button secondary disabled={!selectedAddresses.length} classes="w-full mt-2" onClick={() => rerunProcess()}>
                {locale('views.securityCheckCompleted.rerun')}
            </Button>
            <Button disabled={!selectedAddresses.length} classes="w-full mt-4" onClick={() => handleContinueClick()}>
                {locale('views.securityCheckCompleted.continueMigration')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
            <Illustration illustration="migrate-desktop" height="100%" width="auto" />
        </div>
    </OnboardingLayout>
{/if}
