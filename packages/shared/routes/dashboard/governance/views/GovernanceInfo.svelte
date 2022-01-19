<script lang="typescript">
    import { Text, Icon, Link } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { localize } from 'shared/lib/i18n'
</script>

<div class='h-full flex flex-col justify-between'>
    <div>
        <Text type="h3" classes="mr-5 text-gray-800 mb-5" overrideColor>{localize('views.governance.info.title')}</Text>
        <Text type="p" classes="mr-5 text-gray-700 mb-5 font-normal text-14" overrideColor>{localize('views.governance.info.description')}</Text>
    </div>
    <Link classes="mr-5 text-13 text-gray-800 border border-solid border-gray-300 rounded-xl py-4 pl-6 flex justify-between hover:bg-blue-100"
    onClick={() => Electron.openUrl('https://iotatreasury.org/how-voting-works.html')}>
    {localize('views.governance.info.link')} <Icon icon="chevron-right" classes="flex-shrink-0 mx-4 text-gray-700 dark:text-white" />
    </Link>
</div>
