<script lang="typescript">
    import { getContext } from 'svelte';
    import { SettingsIcons, SettingsTitles, GeneralSettings, SecuritySettings, AdvancedSettings, HelpAndInfo } from '../types'
    import { Text, SettingsMenu } from 'shared/components';

    export let locale
    export let mobile

    const route = getContext('route')
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <div class="h-full w-full flex flex-col">
        <Text type="h2" classes="mb-14">{locale('views.settings.settings')}</Text>
        <div class="flex flex-row items-start space-x-10">
            <SettingsMenu 
                icon='settings'
                iconColor='bg-blue-500'
                icons={SettingsIcons} 
                settings={GeneralSettings} 
                title={locale('views.settings.generalSettings.title')} 
                description={locale('views.settings.generalSettings.description')} 
                onClick={() => route.update(() => SettingsTitles.GeneralSettings)}
                locale={locale} />
            <SettingsMenu 
                icon='security'
                iconColor='bg-yellow-500'
                icons={SettingsIcons} 
                settings={SecuritySettings} 
                title={locale('views.settings.security.title')} 
                description={locale('views.settings.security.description')} 
                onClick={() => route.update(() => SettingsTitles.Security)}
                locale={locale} />
            <SettingsMenu 
                icon='tools'
                iconColor='bg-green-600'
                icons={SettingsIcons} 
                settings={AdvancedSettings} 
                title={locale('views.settings.advancedSettings.title')} 
                description={locale('views.settings.advancedSettings.description')} 
                onClick={() => route.update(() => SettingsTitles.AdvancedSettings)}
                locale={locale} />
            <SettingsMenu 
                icon='info'
                iconColor='bg-purple-500'
                icons={SettingsIcons} 
                settings={HelpAndInfo} 
                title={locale('views.settings.helpAndInfo.title')} 
                description={locale('views.settings.helpAndInfo.description')} 
                onClick={() => route.update(() => SettingsTitles.HelpAndInfo)}
                locale={locale} />
        </div>
    </div>
{/if}
