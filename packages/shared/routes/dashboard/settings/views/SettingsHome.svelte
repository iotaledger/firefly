<script lang="typescript">
    import { Icon, Text } from 'shared/components'

    export let locale
    export let mobile

    enum SettingsTitles {
        GeneralSettings = 'generalSettings',
        Security = 'security',
        AdvancedSettings = 'advancedSettings',
        HelpAndInfo = 'helpAndInfo',
    }

    enum GeneralSettings {
        ProfileDetails = 'profileDetails',
        Theme = 'theme',
        Language = 'language',
        Currency = 'currency',
        Notifications = 'notifications',
    }

    enum Security {
        ExportStronghold = 'exportStronghold',
        AppLock = 'appLock',
        ChangePassword = 'changePassword',
        ResyncAccounts = 'resyncAccounts',
        ResetWallet = 'resetWallet',
    }

    enum AdvancedSettings {
        DeepLinks = 'deepLinks',
        DeveloperMode = 'developerMode',
        NodeSettings = 'nodeSettings',
        ProofOfWork = 'proofOfWork',
        ErrorLog = 'errorLog',
        StateExport = 'stateExport',
    }

    enum HelpAndInfo {
        Troubleshoot = 'troubleshoot',
        Documentation = 'documentation',
        FAQ = 'faq',
        Discord = 'discord',
        About = 'about',
    }

    enum SettingsIcons {
        profileDetails = 'info',
        theme = 'theme',
        language = 'language',
        currency = 'currency',
        notifications = 'bell',
        exportStronghold = 'export',
        appLock = 'pin',
        changePassword = 'lock',
        resyncAccounts = 'sync',
        resetWallet = 'reset',
        deepLinks = 'link',
        developerMode = 'dev',
        nodeSettings = 'settings',
        proofOfWork = 'work',
        errorLog = 'warning',
        stateExport = 'export',
        troubleshoot = 'tools',
        documentation = 'doc',
        faq = 'speech',
        discord = 'discord',
        about = 'help',
    }
</script>

<style type="text/scss">
</style>

{#if mobile}
    <div>foo</div>
{:else}
    <div class="h-full w-full flex flex-col px-5">
        <Text type="h2" classes="mb-12">{locale('views.settings.settings')}</Text>
        <div class="flex flex-row items-start justify-between">
            <div class="flex-1 pr-5">
                <Icon boxed icon="settings" classes="text-white" boxClasses="bg-blue-500 mb-5" />
                <Text type="p" classes="mb-5">{locale('views.settings.generalSettings.title')}</Text>
                <Text type="p" classes="mb-5" secondary>{locale('views.settings.generalSettings.description')}</Text>
                {#each Object.values(GeneralSettings) as setting}
                    <button class="group flex flex-row justify-start items-center hover:bg-blue-50 py-2 rounded-lg w-full">
                        <Icon icon={SettingsIcons[setting]} classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
                        <Text type="p" secondary classes="group-hover:text-blue-500">
                            {locale(`views.settings.${setting}.title`)}
                        </Text>
                    </button>
                {/each}
            </div>
            <div class="flex-1 pr-5">
                <Icon boxed icon="security" classes="text-white" boxClasses="bg-yellow-500 mb-5" />
                <Text type="p" classes="mb-5">{locale('views.settings.security.title')}</Text>
                <Text type="p" classes="mb-5" secondary>{locale('views.settings.security.description')}</Text>
                {#each Object.values(Security) as setting}
                    <button class="group flex flex-row justify-start items-center hover:bg-blue-50 py-2 rounded-lg w-full">
                        <Icon icon={SettingsIcons[setting]} classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
                        <Text type="p" secondary classes="group-hover:text-blue-500">
                            {locale(`views.settings.${setting}.title`)}
                        </Text>
                    </button>
                {/each}
            </div>
            <div class="flex-1 pr-5">
                <Icon boxed icon="tools" classes="text-white" boxClasses="bg-green-600 mb-5" />
                <Text type="p" classes="mb-5">{locale('views.settings.advancedSettings.title')}</Text>
                <Text type="p" classes="mb-5" secondary>{locale('views.settings.advancedSettings.description')}</Text>
                {#each Object.values(AdvancedSettings) as setting}
                    <button class="group flex flex-row justify-start items-center hover:bg-blue-50 py-2 rounded-lg w-full">
                        <Icon icon={SettingsIcons[setting]} classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
                        <Text type="p" secondary classes="group-hover:text-blue-500">
                            {locale(`views.settings.${setting}.title`)}
                        </Text>
                    </button>
                {/each}
            </div>
            <div class="flex-1 pr-5">
                <Icon boxed icon="info" classes="text-white" boxClasses="bg-purple-500 mb-5" />
                <Text type="p" classes="mb-5">{locale('views.settings.helpAndInfo.title')}</Text>
                <Text type="p" classes="mb-5" secondary>{locale('views.settings.helpAndInfo.description')}</Text>
                {#each Object.values(HelpAndInfo) as setting}
                    <button class="group flex flex-row justify-start items-center hover:bg-blue-50 py-2 rounded-lg w-full">
                        <Icon icon={SettingsIcons[setting]} classes="text-gray-500 ml-1 mr-3 group-hover:text-blue-500" />
                        <Text type="p" secondary classes="group-hover:text-blue-500">
                            {locale(`views.settings.${setting}.title`)}
                        </Text>
                    </button>
                {/each}
            </div>
        </div>
    </div>
{/if}
