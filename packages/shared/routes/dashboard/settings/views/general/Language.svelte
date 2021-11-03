<script lang="typescript">
    import { Dropdown, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { locales, localize, setLanguage } from 'shared/lib/i18n'
    import { refreshBalanceOverview, updateAccountsBalanceEquiv } from 'shared/lib/wallet'

    $: languageList = Object.values(locales).map((locale) => ({ value: locale, label: locale }))

    const handleLanguage = (item) => {
        setLanguage(item)
        refreshBalanceOverview()
        updateAccountsBalanceEquiv()
    }
</script>

<style type="text/scss">
    button {
        &.active {
            @apply bg-blue-500;
            @apply bg-opacity-10;
            :global(p) {
                @apply text-blue-500;
            }
        }
    }
</style>

{#if $mobile}
    <div class="flex flex-col flex-wrap space-y-2 overflow-y-auto">
        {#each languageList as language}
            <button
                class="relative flex items-center p-2 w-full whitespace-nowrap rounded-md"
                on:click={() => handleLanguage(language)}
                class:active={language?.label === locales[$appSettings.language]}>
                <Text type="p" smaller>{language?.label}</Text>
            </button>
        {/each}
    </div>
{:else}
    <Text type="h4" classes="mb-3">{localize('views.settings.language.title')}</Text>
    <Dropdown sortItems={true} onSelect={handleLanguage} value={locales[$appSettings.language]} items={languageList} />
{/if}
