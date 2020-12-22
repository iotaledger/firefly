<script lang="typescript">
    import { SettingsHome } from './views'
    export let locale
    export let mobile


    enum SettingsState {
        Init = 'init',
        GeneralSettings = 'generalSettings',
        Security = 'security',
        Advanced = 'advancedSettings',
        HelpAndInfo = 'helpAndInfo'
    }
    
    let state: SettingsState = SettingsState.Init
</script>

<div class="border-l-1 border-gray-100 w-full h-full p-10 flex gap-4 bg-white">
    {#if state === SettingsState.Init}
        <SettingsHome locale={locale} />
    {/if}   
</div>