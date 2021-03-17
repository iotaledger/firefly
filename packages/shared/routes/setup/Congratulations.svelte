<script lang="typescript">
    import { Box,Button,Illustration,OnboardingLayout,Text } from 'shared/components';
    import { AvailableExchangeRates,convertToFiat,currencies,CurrencyTypes,exchangeRates } from 'shared/lib/currency';
    import { newProfile,saveProfile,setActiveProfile } from 'shared/lib/profile';
    import { formatUnit } from 'shared/lib/units';
    import { createEventDispatcher,onMount } from 'svelte';
    import { get } from 'svelte/store';

    export let locale
    export let mobile

    // TODO: dummy
    let wasMigrated = true

    onMount(() => {
        // This is the last screen in onboarding for all flows i.e., if you create a new wallet or import stronghold
        // When this component mounts, ensure that the profile is persisted in the local storage.
        saveProfile($newProfile)
        setActiveProfile($newProfile.id)
        newProfile.set(null)
    })

    const dispatch = createEventDispatcher()

    let balance = Math.floor(Math.random() * 2000000) // TODO: dummy
    let fiatbalance = `${convertToFiat(
        balance,
        get(currencies)[CurrencyTypes.USD],
        get(exchangeRates)[AvailableExchangeRates.USD]
    )} ${CurrencyTypes.USD}`

    const handleContinueClick = () => {
        dispatch('next')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout allowBack={false}>
        <div slot="leftpane__content">
            {#if wasMigrated}
                <Box classes="bg-gray-50 dark:bg-gray-900 dark:bg-opacity-50 rounded-lg p-10">
                    <balance class="flex flex-col flex-grow items-center">
                        <Text type="h1" classes="mb-5 text-center">{locale('views.congratulations.fundsMigrated')}</Text>
                        <Text type="p" secondary classes="mb-4 text-center">{locale('views.congratulations.success')}</Text>
                        <div class="flex mb-2 my-6">
                            <Text type="h2">{formatUnit(balance)}</Text>
                        </div>
                        <Text type="p" highlighted classes="py-1 uppercase">{fiatbalance}</Text>
                    </balance>
                </Box>
            {:else}
                <Text type="h1" classes="mb-5">{locale('views.congratulations.title')}</Text>
                <Text type="p" secondary classes="mb-4">{locale('views.congratulations.body')}</Text>
            {/if}
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" onClick={() => handleContinueClick()}>{locale(`${wasMigrated ? 'views.congratulations.exportMigration' : 'actions.continue'}`)}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center">
            <Illustration width="100%" illustration="congratulations-desktop" />
        </div>
    </OnboardingLayout>
{/if}
