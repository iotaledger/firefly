<script lang="typescript">
    import { handleDeepLink } from '@auxiliary/deep-link'

    import { localize } from '@core/i18n'
    import { closePopup } from '@lib/popup'
    import { Button, Text, TextInput } from 'shared/components'
    import { FontWeight } from '../Text.svelte'

    const PREFIX = process.env.APP_PROTOCOL + '://'
    let url: string = PREFIX

    function handleCancel() {
        closePopup()
    }

    function handleTest(): void {
        closePopup()
        handleDeepLink(url)
    }
</script>

<div class="space-y-6">
    <Text type="h4" fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold}>
        {localize('actions.testDeepLink')}
    </Text>

    <div class="space-y-4 max-h-100 scrollable-y flex-1">
        <TextInput bind:value={url} label={localize('general.url')} placeholder={localize('general.url')} />
    </div>

    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" onClick={handleCancel}>
            {localize('actions.cancel')}
        </Button>
        <Button classes="w-full" onClick={handleTest}>
            {localize('actions.test')}
        </Button>
    </div>
</div>
