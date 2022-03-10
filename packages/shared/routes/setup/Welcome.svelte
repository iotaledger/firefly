<script lang="typescript">
    import { Animation, Button, Dropdown, Logo, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { locales, setLanguage, _ } from 'shared/lib/i18n'
    import { Locale } from 'shared/lib/typings/i18n'
    import { createEventDispatcher } from 'svelte'

    export let locale: Locale

    const dispatch = createEventDispatcher()

    $: languageList = Object.values(locales).map((locale) => ({ value: locale, label: locale }))

    function handleContinueClick() {
        dispatch('next')
    }

    const handleLanguage = (item) => {
        setLanguage(item)
        locale = $_
    }
</script>

<OnboardingLayout allowBack={false}>
    <div slot="leftpane__content">
        <div class="flex flex-col {$mobile && 'items-center text-center px-10'} space-y-4 mb-8">
            {#if !$mobile}
                <Logo width="64px" logo="logo-firefly" classes="mb-6" />
            {/if}
            <Text type={$mobile ? 'h3' : 'h1'}>{locale('views.onboarding1.title')}</Text>
            <Text type="p" secondary>{locale('views.onboarding1.body')}</Text>
        </div>
        {#if $mobile}
            <div class="languages flex flex-wrap space-y-2 overflow-y-auto">
                {#each languageList as language}
                    <button
                        class="relative flex items-center p-2 w-full whitespace-nowrap rounded-md"
                        on:click={() => handleLanguage(language)}
                        class:active={language?.label === locales[$appSettings.language]}
                    >
                        <Text type="p" smaller>{language?.label}</Text>
                    </button>
                {/each}
            </div>
        {:else}
            <Dropdown
                sortItems={true}
                onSelect={handleLanguage}
                value={locales[$appSettings.language]}
                items={languageList}
            />
        {/if}
    </div>
    <div slot="leftpane__action">
        <Button onClick={() => handleContinueClick()} classes="w-full">{locale('actions.continue')}</Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-blue dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="welcome-desktop" />
    </div>
</OnboardingLayout>

<style type="text/scss">
    .languages {
        max-height: calc(100vh - 100vw - 150px);
        @screen md {
            max-height: inherit;
        }
        button {
            &.active {
                @apply bg-blue-500;
                @apply bg-opacity-10;
                :global(p) {
                    @apply text-blue-500;
                }
            }
        }
    }
</style>
