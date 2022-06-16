<script lang="typescript">
    import { appRouter } from '@core/router'
    import { Animation, Button, Dropdown, Logo, OnboardingLayout, Text } from 'shared/components'
    import { appSettings, mobile } from '@core/app'
    import { SUPPORTED_LOCALES, setLanguage, localize } from '@core/i18n'
    import { formatProtocolName, NetworkProtocol } from '@core/network'
    import featureFlags from 'shared/featureFlags.config'

    $: languageList = Object.values(SUPPORTED_LOCALES).map((locale) => ({ value: locale, label: locale }))

    function handleContinueClick(): void {
        $appRouter.next()
    }

    function handleLanguage(item: { value: string }): void {
        setLanguage(item)
    }
</script>

<OnboardingLayout allowBack={false}>
    <div slot="leftpane__content">
        <div class="flex flex-col {$mobile && 'items-center text-center px-10'} space-y-4 mb-8">
            {#if !$mobile}
                <Logo width="64px" logo="logo-firefly" classes="mb-6" />
            {/if}
            <Text type={$mobile ? 'h3' : 'h1'}
                >{localize('views.onboarding1.title', {
                    values: {
                        protocol: featureFlags?.onboarding?.iota?.enabled
                            ? formatProtocolName(NetworkProtocol.IOTA)
                            : formatProtocolName(NetworkProtocol.Shimmer),
                    },
                })}</Text
            >
            <Text type="p" secondary>{localize('views.onboarding1.body')}</Text>
        </div>
        {#if $mobile}
            <div class="languages flex flex-wrap space-y-2 overflow-y-auto">
                {#each languageList as language}
                    <button
                        class="relative flex items-center p-2 w-full whitespace-nowrap rounded-md"
                        on:click={() => handleLanguage(language)}
                        class:active={language?.label === SUPPORTED_LOCALES[$appSettings.language]}
                    >
                        <Text type="p" smaller>{language?.label}</Text>
                    </button>
                {/each}
            </div>
        {:else}
            <Dropdown
                sortItems={true}
                onSelect={handleLanguage}
                value={SUPPORTED_LOCALES[$appSettings.language]}
                items={languageList}
            />
        {/if}
    </div>
    <div slot="leftpane__action">
        <Button onClick={() => handleContinueClick()} classes="w-full">{localize('actions.continue')}</Button>
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
