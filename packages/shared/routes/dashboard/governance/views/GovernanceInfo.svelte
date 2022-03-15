<script lang="typescript">
    import { Text, Icon, Link, Illustration } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { localize } from 'shared/lib/i18n'
</script>

<div class="h-full flex flex-col justify-between">
    <div class="flex justify-center items-center flex-col text-center">
        <Illustration illustration="governance-info" classes="w-32 h-32 mb-8" />
        <Text type="h3" classes="text-gray-800 dark:text-white mb-5" overrideColor
            >{localize('views.governance.info.title')}</Text
        >
        <Text type="p" classes="text-gray-700 dark:text-gray-500 mb-5 font-normal text-14" overrideColor
            >{localize('views.governance.info.description')}</Text
        >
    </div>
    <Link
        classes="mr-5 text-13 text-gray-800 dark:text-white border border-solid border-gray-300 dark:border-transparent rounded-xl 
        py-4 pl-6 flex justify-between bg-gray-50 hover:bg-blue-100 dark:hover:bg-gray-700 bg-gray-900"
        onClick={() => Electron.openUrl('https://iotatreasury.org/how-voting-works.html')}
    >
        {localize('views.governance.info.link')}
        <Icon icon="chevron-right" classes="flex-shrink-0 mx-4 text-gray-700 dark:text-white" />
    </Link>
</div>
