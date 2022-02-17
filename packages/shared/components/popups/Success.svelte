<script lang="typescript">
    import { Text, Icon, Button } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { closePopup } from 'shared/lib/popup'

    export let successText: string
</script>

<div>
    <div class="flex justify-center">
        <Icon icon="success-check" classes="text-white w-full h-full" boxed boxClasses="bg-green-500 justify-center w-11 h-11"/>
    </div>
    <Text type="h2" classes="my-5 text-center">{successText}</Text>
    <Button classes="mb-0 w-full block text-15" onClick={closePopup}>{localize('actions.done')}</Button>
</div>
