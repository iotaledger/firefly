<script lang="typescript">
    import { SettingsIcons, SettingsTitles, GeneralSettings, SecuritySettings, AdvancedSettings, HelpAndInfo } from '../types'

    import { getContext } from 'svelte';
    import { SettingsNavigator, Text, Scroller } from 'shared/components';
    import { General, Security, Advanced } from './';

    export let locale
    export let mobile

    let scroller
    let index

    const settings  = {
        'generalSettings': GeneralSettings, 
        'security': SecuritySettings, 
        'advancedSettings': AdvancedSettings, 
        'helpAndInfo': HelpAndInfo
    }

    const route = getContext('route')

    function scrollIntoView(id) {
        if (id) {
            document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" })
        }
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <div class="flex flex-1 flex-row items-start">
        <SettingsNavigator
            titles={SettingsTitles}
            onSettingClick={(id) => scrollIntoView(id)}
            icons={SettingsIcons}
            settings={settings}
            locale={locale}
        />
        <div class="h-full w-full pb-10" >
            <Text type="p" secondary highlighted classes="mb-8">{locale('views.settings.settings')}   /   {locale(`views.settings.${$route}.title`)}</Text>
            <Scroller classes="w-3/4 h-full pr-100" threshold={70} bind:index bind:this={scroller}>
                <div class='w-11/12'>
                    <Text type="h2" classes="mb-7">{locale(`views.settings.${$route}.title`)}</Text>
                    {#if $route === 'generalSettings'}
                        <General locale={locale}/>
                    {:else if $route === 'security'}
                        <Security locale={locale}/>
                    {:else if $route === 'advancedSettings'}
                        <Advanced locale={locale}/>
                    {:else if $route === 'helpAndInfo'}
                        <div/>
                    {/if}
                </div>
            </Scroller>
        </div>
    </div>
{/if}
