<script lang="typescript">
    import { Text, Button, Icon } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
</script>

<div class="col-span-3 row-span-1 justify-self-end">
    <Text type="p" classes="bg-blue-100 text-14 px-4 py-2 rounded-2xl text-gray-700" overrideColor>
        {localize('views.governance.events.status.commencing')} <Icon icon="info-filled" classes="flex-shrink-0 ml-1 text-gray-500 dark:text-white inline-flex" />
    </Text>
</div>
<div class='mx-8 col-span-3'>
    <Text type="h3" classes="mr-5 text-gray-800 mb-2" overrideColor>{localize('views.governance.events.communityTreasury.title')}</Text>
    <Text type="p" classes="mr-5 text-gray-700 mb-8 text-14" overrideColor>
        {localize('views.governance.events.communityTreasury.description.text1')} {localize('views.governance.events.communityTreasury.description.text2')} 
        <strong>{localize('views.governance.events.communityTreasury.description.text3')}</strong> {localize('general.or')} 
        <strong>{localize('views.governance.events.communityTreasury.description.text4')}</strong>
    </Text>
    <Button classes="w-1/4"><Text type="h5" overrideColor classes="text-white">{localize('views.governance.events.button')}</Text></Button>
</div>
