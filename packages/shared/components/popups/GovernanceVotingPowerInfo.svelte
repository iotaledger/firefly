<script lang="typescript">
    import { Text, Button } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { closePopup } from 'shared/lib/popup'
</script>

<div>
    <Text type="h2" classes="mb-10">{localize('views.governance.votingPower.info.title')}</Text>
    <div class='w-full h-48 bg-lightblue-100 rounded-2xl mb-8 flex justify-center items-center'>
        <Text type="h3" classes="text-gray-800" overrideColor>{localize('views.governance.votingPower.info.equality')}</Text>
    </div>
    <Text type="p" classes="mb-2">{localize('views.governance.votingPower.info.description1')}</Text>
    <Text type="p">{localize('views.governance.votingPower.info.description2')}</Text>
    <Button classes="mb-0 mx-auto mt-10 block w-full text-15" onClick={closePopup}>{localize('actions.done')}</Button>
</div>
