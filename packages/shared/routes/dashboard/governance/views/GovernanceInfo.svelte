<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Icon, Illustration, Text } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
</script>

<div class="p-8 h-full flex flex-col justify-between">
    <div class="flex justify-center items-center flex-col text-center flex-1">
        <Illustration illustration="governance-info" classes="w-32 h-32 mb-6" />
        <Text type="h3" classes="mb-3">{localize('views.governance.info.title')}</Text>
        <Text type="p" classes="mb-4 text-gray-700 dark:text-gray-500" overrideColor
            >{localize('views.governance.info.description')}</Text
        >
    </div>
    <button
        class="border border-solid border-gray-300 dark:border-transparent py-4 px-6 flex justify-between space-x-4 bg-gray-50 hover:bg-blue-100 dark:bg-gray-900 dark:hover:bg-gray-700 rounded-xl w-full"
        on:click={() => Electron.openUrl('https://iotatreasury.org/how-voting-works.html')}
    >
        <Text type="p">{localize('views.governance.info.link')}</Text>
        <Icon icon="chevron-right" classes="flex-shrink-0 text-gray-700 dark:text-gray-500" />
    </button>
</div>
