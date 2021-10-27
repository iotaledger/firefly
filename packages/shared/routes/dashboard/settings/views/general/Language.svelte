<script lang="typescript">
    import { Dropdown, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { locales, localize, setLanguage } from 'shared/lib/i18n'
    import { resetSettingsRoute } from 'shared/lib/router'
    import { refreshBalanceOverview, updateAccountsBalanceEquiv } from 'shared/lib/wallet'

    const handleLanguage = (item) => {
        setLanguage(item)
        refreshBalanceOverview()
        updateAccountsBalanceEquiv()
        // resetSettingsRoute()
    }

    $: languageList = Object.values(locales).map((locale) => ({ value: locale, label: locale }))
</script>

<section id="language" class="w-full md:w-3/4">
    {#if $mobile}
        <div class="inner overflow-y-auto scroll-secondary">
            {#each languageList as language}
                <button
                    class="relative flex items-center p-4 w-full whitespace-nowrap
                    {language?.label === locales[$appSettings.language] && 'bg-gray-100 dark:bg-gray-700 dark:bg-opacity-20'} 
                    hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-20
                    focus:bg-gray-200 dark:focus:bg-gray-800 dark:focus:bg-opacity-20"
                    id={language?.label}
                    on:click={() => handleLanguage(language)}
                    class:active={language?.label === locales[$appSettings.language]}>
                    <Text type="p" smaller>{language?.label}</Text>
                </button>
            {/each}
        </div>
    {:else}
        <Text type="h4" classes="mb-3">{localize('views.settings.language.title')}</Text>
        <Dropdown
            sortItems={true}
            onSelect={handleLanguage}
            value={locales[$appSettings.language]}
            items={languageList} />
    {/if}
</section>
