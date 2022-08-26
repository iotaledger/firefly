<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Button, Icon, Text } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'

    export let title: string
    export let body: string
</script>

<div class="pt-8">
    <div class="rounded-lg relative flex flex-col items-center text-center px-4 py-10 bg-gray-50 dark:bg-gray-800 mb-6">
        <div class="absolute -top-5">
            <Icon
                icon="success-check"
                boxed
                boxClasses="bg-green-500 justify-center w-11 h-11"
                classes="text-white w-full h-full"
            />
        </div>
        {#if title}
            <Text type="h2" classes="mb-4">{title}</Text>
        {/if}
        {#if body}
            <Text type="p">{body}</Text>
        {/if}
    </div>
    <Button classes="mb-0 w-full block text-15" onClick={closePopup}>{localize('actions.done')}</Button>
</div>
