<script lang="typescript">
    import { Button, Icon, Illustration, OnboardingLayout, Radio, Text } from 'shared/components'
    import { darkMode } from 'shared/lib/app'
    import { createEventDispatcher } from 'svelte'

    export let locale
    export let mobile

    let darkModeEnabled = $darkMode

    $: darkMode.set(darkModeEnabled)

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        dispatch('next')
    }
    function handleBackClick() {
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5">{locale('views.appearance.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.appearance.body')}</Text>
            <Text type="p" classes="mb-2 mt-4" smaller>{locale('general.appearance')}</Text>
            <!-- TODO: Enable -->
            <div class="pointer-events-none opacity-50">
                <button
                    on:click={() => (darkModeEnabled = false)}
                    class="w-full flex flex-row p-4 mb-4 rounded-2xl border border-1 border-solid items-center justify-between border-gray-300 hover:border-gray-500 focus:border-gray-500">
                    <div class="flex flex-row items-center">
                        <Icon icon="theme-light" classes="text-blue-500" />
                        <Text smaller classes="ml-3">{locale('general.lightTheme')}</Text>
                    </div>
                    <Radio value={false} bind:group={darkModeEnabled} classes="mb-0" tabindex={-1} />
                </button>
                <button
                    on:click={() => (darkModeEnabled = true)}
                    class="w-full flex flex-row p-4 mb-4 rounded-2xl border border-1 border-solid items-center justify-between border-gray-300 hover:border-gray-500 focus:border-gray-500">
                    <div class="flex flex-row items-center">
                        <Icon icon="theme-dark" classes="text-blue-500" />
                        <Text smaller classes="ml-3">{locale('general.darkTheme')}</Text>
                    </div>
                    <Radio value={true} bind:group={darkModeEnabled} classes="mb-0" tabindex={-1} />
                </button>
            </div>
        </div>
        <div slot="leftpane__action">
            <Button onClick={() => handleContinueClick()} classes="w-full">{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center p-16" style="background-color: #FFF8EF">
            <Illustration illustration="appearance-desktop" width="auto" height="auto" />
        </div>
    </OnboardingLayout>
{/if}
